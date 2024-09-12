"use server";

import { getPrisma } from "@/lib/utils/database";
import {
  ProductPriceInputType,
  ProductPriceType,
  updateProductInputType,
} from "@/types/product";
import { Product } from "@prisma/client";
import { includeData } from "./common/include";
const prisma = getPrisma();

export const updateProductAction = async (
  id: string,
  data: updateProductInputType,
): Promise<Product> => {
  return await prisma.product.update({
    where: { id },
    data,
    include: includeData,
  });
};

export const updateProductInventoryPriceAction = async (
  data: ProductPriceInputType,
): Promise<ProductPriceType> => {
  const [_, newProductPrice] = await prisma.$transaction([
    prisma.productPrice.updateMany({
      where: {
        inventoryId: data.inventoryId,
      },
      data: {
        active: false,
      },
    }),
    prisma.productPrice.create({
      data: {
        active: true,
        unit: data.unit,
        unitPrice: data.unitPrice,
        inventoryId: data.inventoryId,
      },
    }),
  ]);

  return newProductPrice;
};
