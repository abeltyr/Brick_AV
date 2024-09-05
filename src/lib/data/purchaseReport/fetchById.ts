"use server";

import { getPrisma } from "@/lib/utils/database";
import { Purchase } from "@prisma/client";
const prisma = getPrisma();

export const findPurchaseByIdAction = async (
  id: string,
): Promise<Purchase | null> => {
  return await prisma.purchase.findUnique({
    where: { id },
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
