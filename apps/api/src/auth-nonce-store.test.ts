import assert from "node:assert/strict";
import test from "node:test";
import { MemoryAuthNonceStore } from "./auth-nonce-store.js";

test("consumes a nonce atomically and rejects replay", async () => {
  const store = new MemoryAuthNonceStore();
  await store.issue("nonce-1", Date.now() + 10_000);
  assert.equal(await store.consume("nonce-1", Date.now()), true);
  assert.equal(await store.consume("nonce-1", Date.now()), false);
});

test("rejects expired nonces", async () => {
  const store = new MemoryAuthNonceStore();
  await store.issue("expired", Date.now() - 1);
  assert.equal(await store.consume("expired", Date.now()), false);
});
