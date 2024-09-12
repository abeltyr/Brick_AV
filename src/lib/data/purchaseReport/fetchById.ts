"use server";

import { getPrisma } from "@/lib/utils/database";
import { Purchase, PurchaseReport } from "@prisma/client";
const prisma = getPrisma();

export const findPurchaseReportByIdAction = async (
  id: string,
): Promise<PurchaseReport | null> => {
  return await prisma.purchaseReport.findUnique({
    where: { id },
  });
};
