# SentinelMesh Production Runbook

SentinelMesh can run as a production risk-analysis and evidence service without deploying a blockchain contract. Registry verification is an optional capability.

## Required architecture

- Next.js frontend on a managed HTTPS host.
- API container with `NODE_ENV=production`.
- Managed Postgres with automated backups.
- Explicit frontend origin and SIWE domain allowlists.
- A 32+ character randomly generated session secret.

The API fails during startup when these production requirements are absent. It never silently falls back to JSON reports or in-memory SIWE replay protection in production.

## Release gate

Every release must pass:

```bash
npm ci
npm run typecheck
npm test
npm run build
npm audit --audit-level=critical
(cd contracts && forge test)
```

The GitHub Actions workflow runs the same gate on pushes and pull requests.

The current wallet connector tree has upstream moderate/high advisories whose automated fix requires a major wagmi/RainbowKit migration. Track that migration separately and do not use blanket dependency overrides that violate transitive semver requirements.

## Health and readiness

- `/health` proves the process is alive.
- `/ready` verifies fixtures, report storage, and Postgres-backed nonce storage initialization.
- Inspect `capabilities.registryConfigured`; `false` is healthy for a deployment that intentionally does not use a registry.
- Every API response includes `X-Request-Id`. Production logs emit one JSON record per completed request.

## Data safety

- Postgres stores reports, idempotency keys, and one-time SIWE nonces.
- Enable point-in-time recovery and daily backups with the database provider.
- Idempotency keys prevent duplicate reports when clients retry requests.
- Rotate `SESSION_SECRET` during a security incident; this invalidates existing sessions.
- Never log cookies, wallet signatures, API keys, seed phrases, private keys, or full authorization headers.

## Incident response

1. Disable affected API traffic at the hosting edge.
2. Rotate session, RPC, AI, and database credentials as applicable.
3. Preserve structured logs using `X-Request-Id` for correlation.
4. Restore Postgres to a verified recovery point if integrity is in doubt.
5. Run the full release gate and a clean-browser smoke test before reopening traffic.

## Scaling

Postgres-backed nonces and idempotency make multiple API replicas safe. Put edge or provider-level rate limiting in front of the API when scaling beyond one replica; the built-in limiter remains a local defense-in-depth control.
