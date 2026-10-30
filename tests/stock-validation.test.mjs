import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import ts from "typescript";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const source = readFileSync(
  new URL("../src/lib/validateStockQuantity.ts", import.meta.url),
  "utf8"
);

const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;

const testModule = { exports: {} };
new Function("module", "exports", "require", compiled)(
  testModule,
  testModule.exports,
  require
);

const { validateStockQuantity } = testModule.exports;

test("accepts valid stock quantities", () => {
  for (const value of [null, 0, 1, 50, 2147483647]) {
    assert.equal(validateStockQuantity(value), value);
  }
});

test("rejects invalid stock quantities", () => {
  const invalid = [
    -1,
    1.5,
    2147483648,
    "5",
    undefined,
    NaN,
    Infinity,
    true,
  ];

  for (const value of invalid) {
    assert.throws(
      () => validateStockQuantity(value),
      /Stock quantity must be null or a non-negative whole number/
    );
  }
});
