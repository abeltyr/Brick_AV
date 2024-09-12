"use server";

import { getPrisma } from "@/lib/utils/database";
import { ProductPrice } from "@prisma/client";
const prisma = getPrisma();

export const findProductPriceAction = async (
  inventoryId: string,
): Promise<ProductPrice[]> => {
  return await prisma.productPrice.findMany({
    where: { inventoryId },
    orderBy: {
      createdAt: "desc",
    },
  });
};
