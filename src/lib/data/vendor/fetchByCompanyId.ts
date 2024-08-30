"use server";

import { getPrisma } from "@/lib/utils/database";
import { limitSetter } from "@/lib/utils/limiter";
import { Filter } from "@/types/shared";
import { Prisma, Vendor } from "@prisma/client";
const prisma = getPrisma();

export const fetchVendorsByCompanyIdAction = async ({
  companyId,
  filter,
}: {
  companyId: string;
  filter: Filter;
}): Promise<Vendor[]> => {
  let limit = limitSetter({ limit: filter.limit });
  let orderBy: Prisma.SortOrder = filter && filter.before ? "asc" : "desc";

  let where: Prisma.VendorWhereInput = { companyId };

  let cursor = filter && filter.before ? filter.before : filter.after;

  let myCursor: Prisma.VendorWhereUniqueInput | undefined;
  let skip = 0;

  if (cursor) {
    myCursor = {
      id: cursor,
    };
    skip = 1;
  }

  return await prisma.vendor.findMany({
    where,
    take: limit,
    cursor: myCursor,
    orderBy: {
      createdAt: orderBy,
    },
    skip,
    include: {
      profile: {
        include: {
          address: true,
        },
      },
    },
  });
};
