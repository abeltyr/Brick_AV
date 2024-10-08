"use server";

import { getPrisma } from "@/lib/utils/database";
import { ProductPriceInputType, updateProductInputType } from "@/types/product";
import { Product, ProductPrice } from "@prisma/client";
import { productIncludeData } from "./common/include";
const prisma = getPrisma();

export const updateProductAction = async (
  id: string,
  data: updateProductInputType,
): Promise<Product> => {
  return await prisma.product.update({
    where: { id },
    data,
    include: productIncludeData,
  });
};

export const updateProductInventoryPriceAction = async (
  data: ProductPriceInputType,
): Promise<ProductPrice> => {
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
