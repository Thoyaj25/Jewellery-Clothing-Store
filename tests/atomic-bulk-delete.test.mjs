import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import ts from "typescript";

const nodeRequire = createRequire(import.meta.url);

const source = readFileSync(
  new URL("../src/repositories/postgresProductRepository.ts", import.meta.url),
  "utf8"
);

const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;

function createRepository({ existing, referenced = false, deleted }) {
  const calls = [];
  let rolledBack = false;

  const client = {
    async query(sql, params) {
      calls.push(sql.trim());

      if (sql.includes("SELECT id") && sql.includes("FOR UPDATE")) {
        return { rows: existing.map((id) => ({ id })) };
      }

      if (sql.includes("FROM public.order_items")) {
        return { rows: referenced ? [{ "?column?": 1 }] : [] };
      }

      if (sql.includes("DELETE FROM public.products")) {
        return { rows: deleted.map((id) => ({ id })) };
      }

      throw new Error(`Unexpected SQL: ${sql}`);
    },
  };

  const db = {
    query: async () => {
      throw new Error("Unexpected direct database query");
    },
    withTransaction: async (callback) => {
      try {
        return await callback(client);
      } catch (error) {
        rolledBack = true;
        throw error;
      }
    },
  };

  const module = { exports: {} };

  new Function("module", "exports", "require", compiled)(
    module,
    module.exports,
    (name) => {
      if (name === "@/src/lib/db") return db;
      return nodeRequire(name);
    }
  );

  return {
    repository: module.exports.postgresProductRepository,
    calls,
    get rolledBack() {
      return rolledBack;
    },
  };
}

test("deletes all eligible selected products", async () => {
  const env = createRepository({
    existing: [10, 20],
    deleted: [10, 20],
  });

  assert.equal(
    await env.repository.deleteProducts([10, 20]),
    2
  );

  assert.equal(
    env.calls.filter((sql) => sql.includes("DELETE FROM")).length,
    1
  );
});

test("missing product prevents all deletions", async () => {
  const env = createRepository({
    existing: [10],
    deleted: [],
  });

  assert.equal(
    await env.repository.deleteProducts([10, 20]),
    0
  );

  assert.equal(
    env.calls.some((sql) => sql.includes("DELETE FROM")),
    false
  );
});

test("products with order history prevent all deletions", async () => {
  const env = createRepository({
    existing: [10, 20],
    referenced: true,
    deleted: [],
  });

  assert.equal(
    await env.repository.deleteProducts([10, 20]),
    0
  );

  assert.equal(
    env.calls.some((sql) => sql.includes("DELETE FROM")),
    false
  );
});

test("incomplete deletion throws for transaction rollback", async () => {
  const env = createRepository({
    existing: [10, 20],
    deleted: [10],
  });

  await assert.rejects(
    env.repository.deleteProducts([10, 20]),
    /incomplete/
  );

  assert.equal(env.rolledBack, true);
});

test("duplicate IDs are counted only once", async () => {
  const env = createRepository({
    existing: [10],
    deleted: [10],
  });

  assert.equal(
    await env.repository.deleteProducts([10, 10]),
    1
  );
});

test("empty selection performs no database operations", async () => {
  const env = createRepository({
    existing: [],
    deleted: [],
  });

  assert.equal(await env.repository.deleteProducts([]), 0);
  assert.equal(env.calls.length, 0);
});
