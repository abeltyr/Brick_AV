"use server";

import { getPrisma } from "@/lib/utils/database";
import {
  Product,
  ProductType,
  ProductUnit,
  PurchaseType,
} from "@prisma/client";
const prisma = getPrisma();

export const updateProductAction = async (
  id: string,
  data: {
    name?: string;
    description?: string;
    type?: ProductType;
    purchaseType?: PurchaseType;
    active?: boolean;
    purchase?: boolean;
  },
): Promise<Product> => {
  return await prisma.product.update({
    where: { id },
    data,
  });
};
