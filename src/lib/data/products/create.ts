"use server";

import { getPrisma } from "@/lib/utils/database";
import {
  Product,
  ProductType,
  ProductUnit,
  PurchaseType,
} from "@prisma/client";
import Decimal from "decimal.js";
const prisma = getPrisma();

export const createProductAction = async (data: {
  companyId: string;
  name: string;
  description?: string;
  type?: ProductType;
  purchaseType: PurchaseType;
  active?: boolean;
  purchase?: boolean;
  unitPrice: Decimal;
  unit: ProductUnit;
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
      ProductPrice: {
        create: {
          unit: data.unit,
          unitPrice: data.unitPrice,
          active: true,
        },
      },
      Inventory: {
        create: {
          quantity: 0,
        },
      },
    },
    include: {
      ProductPrice: {
        where: {
          active: true,
        },
      },
      Inventory: true,
    },
  });
};
