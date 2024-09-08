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
import { v4 } from "uuid";

function generate8CharUUID() {
  return v4().replace(/-/g, "").slice(0, 8); // Remove dashes and take the first 8 characters
}

export const createProductAction = async (data: {
  companyId: string;
  name: string;
  description?: string;
  type?: ProductType;
  purchaseType: PurchaseType;
  active?: boolean;
  purchase?: boolean;
  unitPrice: number;
  unit: ProductUnit;
}): Promise<Product> => {
  const productCode = generate8CharUUID();
  return await prisma.product.create({
    data: {
      name: data.name,
      description: data.description,
      type: data.type,
      purchaseType: data.purchaseType,
      active: true,
      purchase: data.purchase,
      companyId: data.companyId,
      productCode: `${data.name.slice(0, 2).toUpperCase()}-${productCode}`,
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
