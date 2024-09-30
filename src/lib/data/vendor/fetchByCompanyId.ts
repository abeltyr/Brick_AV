"use server";

import { getPrisma } from "@/lib/utils/database";
import { limitSetter } from "@/lib/utils/limiter";
import { Filter } from "@/types/shared";
import { Prisma, Vendor } from "@prisma/client";
import { vendorIncludeData } from "./common/include";
const prisma = getPrisma();

export const fetchVendorsByCompanyIdAction = async ({
  companyId,
  filter,
  keyTerm,
}: {
  companyId: string;
  filter: Filter;
  keyTerm?: string;
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

  if (keyTerm) {
    where = {
      OR: [
        {
          name: {
            contains: keyTerm,
            mode: "insensitive",
          },
        },
        {
          business: {
            OR: [
              {
                managerName: {
                  contains: keyTerm,
                  mode: "insensitive",
                },
              },
              {
                tin: {
                  contains: keyTerm,
                  mode: "insensitive",
                },
              },
              {
                businessName: {
                  contains: keyTerm,
                  mode: "insensitive",
                },
              },
            ],
          },
        },
      ],
    };
  }

  return await prisma.vendor.findMany({
    where,
    take: limit,
    cursor: myCursor,
    orderBy: {
      createdAt: orderBy,
    },
    skip,
    include: vendorIncludeData,
  });
};
