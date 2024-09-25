import { ProductPurchaseType } from "@prisma/client";
import { z } from "zod";

export const productInputType = [
  {
    value: "Good",
    data: "Good",
  },
  {
    value: "Service",
    data: "Service",
  },
];
export const productInputUnit = [
  { value: "KG", data: "KG" },
  { value: "ML", data: "ML" },
  { value: "GM", data: "GM" },
  { value: "LIT", data: "LIT" },
  { value: "MT", data: "MT" },
  { value: "PCS", data: "PCS" },
  { value: "CT", data: "CT" },
  { value: "OTHER", data: "OTHER" },
  { value: "PC", data: "PC" },
];

export const purchaseTypeConvertor = (inputData: ProductPurchaseType) => {
  let returnValue = 1;
  switch (inputData) {
    case "taxableLocalCapitalAssets":
      returnValue = 1;
      return 1;
    case "taxableImportedCapitalAssets":
      returnValue = 2;
      return 2;
    case "taxableLocalInputs":
      returnValue = 3;
      return 3;
    case "taxableImportedInputs":
      returnValue = 4;
      return 4;
    case "taxableGeneralExpenseInputs":
      returnValue = 5;
      return 5;
    case "taxExemptedPurchase":
      returnValue = 6;
      return 6;
  }
};

export const purchaseInputType = [
  {
    value: "taxableLocalCapitalAssets",
    data: "Taxable Local Capital Assets",
  },
  {
    value: "taxableImportedCapitalAssets",
    data: "Taxable Imported Capital Assets",
  },
  {
    value: "taxableLocalInputs",
    data: "Taxable Local Inputs",
  },
  {
    value: "taxableImportedInputs",
    data: "Taxable Imported Inputs",
  },
  {
    value: "taxableGeneralExpenseInputs",
    data: "Taxable General Expense Inputs",
  },
  {
    value: "taxExemptedPurchase",
    data: "Tax Exempted Purchase",
  },
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
