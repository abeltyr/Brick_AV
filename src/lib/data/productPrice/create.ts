"use server";

import { getPrisma } from "@/lib/utils/database";
import { ProductPrice, ProductUnit } from "@prisma/client";
const prisma = getPrisma();

export const createProductAction = async (data: {
  productId: string;
  unit: ProductUnit;
  unitPrice: number;
}): Promise<ProductPrice> => {
  await prisma.productPrice.updateMany({
    where: {
      productId: data.productId,
      active: true,
    },
    data: {
      productId: data.productId,
      active: false,
    },
  });
  return await prisma.productPrice.create({
    data: {
      productId: data.productId,
      unit: data.unit,
      unitPrice: data.unitPrice,
      active: true,
    },
  });
};
