import { ProductType, Purchase, PurchaseProduct } from "@prisma/client";
import { VendorType } from "./vendor";

export type PurchaseType = Purchase & {
  PurchaseProduct?: PurchaseProductType;
  vendor?: VendorType;
};

export type PurchaseProductType = PurchaseProduct & {
  product?: ProductType;
};
