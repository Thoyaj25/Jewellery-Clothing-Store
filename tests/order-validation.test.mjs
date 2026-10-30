import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import ts from "typescript";

const require = createRequire(import.meta.url);

const source = readFileSync(
  new URL("../src/lib/validateOrderInput.ts", import.meta.url),
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

const { validateOrderInput, OrderValidationError } = testModule.exports;

function validOrder() {
  return {
    submissionKey: "123e4567-e89b-42d3-a456-426614174000",
    customerName: "Test Customer",
    customerMobile: "9876543210",
    customerEmail: "test@example.com",
    deliveryAddress: "Test Address",
    deliveryCity: "Hyderabad",
    deliveryState: "Telangana",
    deliveryPincode: "500001",
    items: [{ productId: 1, quantity: 2 }],
  };
}

test("accepts valid order details", () => {
  const result = validateOrderInput(validOrder());

  assert.equal(result.customerName, "Test Customer");
  assert.equal(result.quantities.get(1), 2);
});

test("rejects invalid customer mobile", () => {
  assert.throws(
    () => validateOrderInput({
      ...validOrder(),
      customerMobile: "invalid",
    }),
    OrderValidationError
  );
});

test("rejects invalid delivery pincode", () => {
  assert.throws(
    () => validateOrderInput({
      ...validOrder(),
      deliveryPincode: "123",
    }),
    OrderValidationError
  );
});

test("rejects invalid item quantity", () => {
  assert.throws(
    () => validateOrderInput({
      ...validOrder(),
      items: [{ productId: 1, quantity: 100 }],
    }),
    OrderValidationError
  );
});

test("rejects duplicate product quantities above 99", () => {
  assert.throws(
    () => validateOrderInput({
      ...validOrder(),
      items: [
        { productId: 1, quantity: 60 },
        { productId: 1, quantity: 40 },
      ],
    }),
    OrderValidationError
  );
});
