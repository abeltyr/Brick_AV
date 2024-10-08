"use server";

import { getPrisma } from "@/lib/utils/database";
import { Purchase } from "@prisma/client";
import { purchaseIncludeData } from "./common/include";
const prisma = getPrisma();

export const findPurchaseByIdAction = async (
  id: string,
): Promise<Purchase | null> => {
  return await prisma.purchase.findUnique({
    where: { id },
    include: purchaseIncludeData,
  });
};
