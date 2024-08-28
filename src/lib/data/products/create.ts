"use server";

import { getPrisma } from "@/lib/utils/database";
import {
  Product,
  ProductType,
  ProductUnit,
  PurchaseType,
} from "@prisma/client";
const prisma = getPrisma();

export const createProductAction = async (data: {
  companyId: string;
  name: string;
  description?: string;
  type?: ProductType;
  purchaseType: PurchaseType;
  active?: boolean;
  purchase?: boolean;
}): Promise<Product> => {
  return await prisma.product.create({
    data: {
      name: data.name,
      description: data.description,
      type: data.type,
      purchaseType: data.purchaseType,

      active: true,
      purchase: data.purchase,
      companyId: data.companyId,
    },
  });
};
