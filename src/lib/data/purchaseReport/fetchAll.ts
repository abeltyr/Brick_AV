"use server";

import { getPrisma } from "@/lib/utils/database";
import { limitSetter } from "@/lib/utils/limiter";
import { Filter } from "@/types/shared";
import { Prisma, Purchase } from "@prisma/client";

const prisma = getPrisma();

export const fetchAllPurchaseReportAction = async ({
  companyId,
  year,
  month,
}: {
  companyId: string;
  year: number;
  month: number;
}) => {
  // return await prisma.purchaseReport.findMany({
  //   where: {
  //     companyId,
  //     year,
  //     OR: [
  //       {
  //         month: {
  //           gte: 0,
  //         },
  //       },
  //       {
  //         month: {
  //           lte: 12,
  //         },
  //       },
  //     ],
  //   },
  //   orderBy: [
  //     {
  //       month: "desc",
  //     },
  //   ],
  // });
};
