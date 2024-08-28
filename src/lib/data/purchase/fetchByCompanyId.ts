"use server";

import { getPrisma } from "@/lib/utils/database";
import { Purchase } from "@prisma/client";
const prisma = getPrisma();

export const findPurchaseByCompanyIdAction = async (
  companyId: string,
): Promise<Purchase[]> => {
  return await prisma.purchase.findMany({
    where: { companyId },
    include: {
      PurchaseProduct: {
        include: {
          product: true,
        },
      },
      vendor: {
        include: {
          profile: {
            include: {
              address: true,
            },
          },
        },
      },
    },
  });
};
