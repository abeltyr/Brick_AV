"use server";

import { getPrisma } from "@/lib/utils/database";
import { limitSetter } from "@/lib/utils/limiter";
import { Filter } from "@/types/shared";
import { Prisma } from "@prisma/client";
import { chartOfAccountIncludeData } from "./common/include";
import { ChartOfAccountType } from "@/types/purchase";
const prisma = getPrisma();

export const fetchChartOfAccountAction = async ({
  companyId,
  filter,
}: {
  companyId: string;
  filter: Filter;
}): Promise<ChartOfAccountType[]> => {
  let limit = limitSetter({ limit: filter.limit });
  let orderBy: Prisma.SortOrder = filter && filter.before ? "desc" : "asc";

  let where: Prisma.ChartOfAccountWhereInput = { companyId };

  let cursor = filter && filter.before ? filter.before : filter.after;

  let myCursor: Prisma.ChartOfAccountWhereUniqueInput | undefined;
  let skip = 0;

  if (cursor) {
    myCursor = {
      id: cursor,
    };
    skip = 1;
  }

  return (await prisma.chartOfAccount.findMany({
    where,
    take: limit,
    cursor: myCursor,
    orderBy: [
      {
        code: orderBy,
      },
    ],
    skip,
    include: chartOfAccountIncludeData,
  })) as ChartOfAccountType[];
};
