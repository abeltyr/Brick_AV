"use server";

"use server";

import { getPrisma } from "@/lib/utils/database";
import { limitSetter } from "@/lib/utils/limiter";
import { Filter } from "@/types/shared";
import { Prisma, Product } from "@prisma/client";
const prisma = getPrisma();

export const fetchProductsByCompanyIdAction = async ({
  companyId,
  filter,
}: {
  companyId: string;
  filter: Filter;
}): Promise<Product[]> => {
  let limit = limitSetter({ limit: filter.limit });
  let orderBy: Prisma.SortOrder = filter && filter.before ? "asc" : "desc";

  let where: Prisma.ProductWhereInput = { companyId };

  let cursor = filter && filter.before ? filter.before : filter.after;

  let myCursor: Prisma.ProductWhereUniqueInput | undefined;
  let skip = 0;

  if (cursor) {
    myCursor = {
      id: cursor,
    };
    skip = 1;
  }

  return await prisma.product.findMany({
    where,
    take: limit,
    cursor: myCursor,
    orderBy: [
      {
        id: orderBy,
      },
    ],
    skip,
    include: {
      ProductPrice: {
        where: {
          active: true,
        },
      },
      Inventory: true,
    },
  });
};
