import { Pool } from "pg";

export interface AuthNonceStore {
  issue(nonce: string, expiresAt: number): Promise<void>;
  consume(nonce: string, now: number): Promise<boolean>;
}

export class MemoryAuthNonceStore implements AuthNonceStore {
  private readonly nonces = new Map<string, number>();

  async issue(nonce: string, expiresAt: number) {
    for (const [candidate, expiry] of this.nonces) if (expiry <= Date.now()) this.nonces.delete(candidate);
    this.nonces.set(nonce, expiresAt);
  }

  async consume(nonce: string, now: number) {
    const expiresAt = this.nonces.get(nonce);
    this.nonces.delete(nonce);
    return Boolean(expiresAt && expiresAt > now);
  }
}

export class PostgresAuthNonceStore implements AuthNonceStore {
  private constructor(private readonly pool: Pool) {}

  static async connect(connectionString: string, ssl: boolean) {
    const pool = new Pool({ connectionString, max: 5, idleTimeoutMillis: 30_000, connectionTimeoutMillis: 5_000, ssl: ssl ? { rejectUnauthorized: false } : undefined });
    const store = new PostgresAuthNonceStore(pool);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS sentinel_auth_nonces (
        nonce text PRIMARY KEY,
        expires_at timestamptz NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now()
      );
      CREATE INDEX IF NOT EXISTS sentinel_auth_nonces_expires_idx ON sentinel_auth_nonces (expires_at);
    `);
    return store;
  }

  async issue(nonce: string, expiresAt: number) {
    await this.pool.query("DELETE FROM sentinel_auth_nonces WHERE expires_at <= now()");
    await this.pool.query("INSERT INTO sentinel_auth_nonces (nonce, expires_at) VALUES ($1, $2)", [nonce, new Date(expiresAt)]);
  }

  async consume(nonce: string, now: number) {
    const result = await this.pool.query(
      "DELETE FROM sentinel_auth_nonces WHERE nonce = $1 AND expires_at > $2 RETURNING nonce",
      [nonce, new Date(now)]
    );
    return (result.rowCount ?? 0) === 1;
  }
}

export async function createAuthNonceStore(databaseUrl?: string, ssl = false): Promise<{ store: AuthNonceStore; provider: "memory" | "postgres" }> {
  if (!databaseUrl) return { store: new MemoryAuthNonceStore(), provider: "memory" };
  return { store: await PostgresAuthNonceStore.connect(databaseUrl, ssl), provider: "postgres" };
}
