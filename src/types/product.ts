import { Inventory, Product, ProductPrice } from "@prisma/client";
import { z } from "zod";

export type ProductType = Product & {
  ProductPrice?: ProductPrice;
  Inventory?: Inventory;
};

export const productInputType = ["Good", "Service"];

export const productInputUnit = [
  "KG",
  "ML",
  "GM",
  "LIT",
  "MT",
  "PCS",
  "CT",
  "OTHER",
  "PC",
];

export const purchaseInputType = [
  { value: "taxableLocalCapitalAssets", data: "Taxable Local Capital Assets" },
  {
    value: "taxableImportedCapitalAssets",
    data: "Taxable Imported Capital Assets",
  },
  { value: "taxableLocalInputs", data: "Taxable Local Inputs" },
  { value: "taxableImportedInputs", data: "Taxable Imported Inputs" },
  {
    value: "taxableGeneralExpenseInputs",
    data: "Taxable General Expense Inputs",
  },
  { value: "taxExemptedPurchase", data: "Tax Exempted Purchase" },
];

export const zProductInputType = z.enum(["Good", "Service"]);
export const zProductInputUnit = z.enum([
  "KG",
  "ML",
  "GM",
  "LIT",
  "MT",
  "PCS",
  "CT",
  "OTHER",
  "PC",
]);

export const zPurchaseInputType = z.enum([
  "taxableLocalCapitalAssets",
  "taxableImportedCapitalAssets",
  "taxableLocalInputs",
  "taxableImportedInputs",
  "taxableGeneralExpenseInputs",
  "taxExemptedPurchase",
]);

export type PurchaseInputType =
  | "taxableLocalCapitalAssets"
  | "taxableImportedCapitalAssets"
  | "taxableLocalInputs"
  | "taxableImportedInputs"
  | "taxableGeneralExpenseInputs"
  | "taxExemptedPurchase";

export type ProductInputType = "Good" | "Service";
