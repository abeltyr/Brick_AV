import {
  ProductType,
  Purchase,
  PurchaseProduct,
  PurchaseReport,
} from "@prisma/client";
import { VendorType } from "./vendor";

export type PurchaseReportType = PurchaseReport & {
  Purchase?: PurchaseType;
};

export type PurchaseType = Purchase & {
  PurchaseProduct?: PurchaseProductType;
  vendor?: VendorType;
};

export type PurchaseProductType = PurchaseProduct & {
  product?: ProductType;
};
