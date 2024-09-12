"use server";

import { getPrisma } from "@/lib/utils/database";
import { Product } from "@prisma/client";
import { includeData } from "./common/include";
const prisma = getPrisma();

export const findProductByIdAction = async (
  id: string,
): Promise<Product | null> => {
  return await prisma.product.findUnique({
    where: { id },
    include: includeData,
  });
};
