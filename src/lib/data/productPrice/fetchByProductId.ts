"use server";

import { getPrisma } from "@/lib/utils/database";
import { ProductPrice } from "@prisma/client";
const prisma = getPrisma();

export const findProductsByProductIdAction = async (
  productId: string,
): Promise<ProductPrice[]> => {
  return await prisma.productPrice.findMany({
    where: { productId },
    orderBy: {
      createdAt: "desc",
    },
  });
};
