"use server";

import { getPrisma } from "@/lib/utils/database";
import { Product } from "@prisma/client";
const prisma = getPrisma();

export const findProductsByCompanyIdAction = async (
  companyId: string,
): Promise<Product[]> => {
  return await prisma.product.findMany({
    where: { companyId },
    include: {
      ProductPrice: {
        where: {
          active: true,
        },
      },
    },
  });
};
