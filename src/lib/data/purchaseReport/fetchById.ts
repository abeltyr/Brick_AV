"use server";

import { getPrisma } from "@/lib/utils/database";
import { Purchase } from "@prisma/client";
const prisma = getPrisma();

export const findPurchaseReportByIdAction = async (id: string) => {
  // return await prisma.purchaseReport.findUnique({
  //   where: { id },
  // });
};
