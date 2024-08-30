import { Inventory, Product, ProductPrice } from "@prisma/client";

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
