"use server";

"use server";

import { getPrisma } from "@/lib/utils/database";
import { limitSetter } from "@/lib/utils/limiter";
import { DateRangeType, RangeType } from "@/types/common";
import { Filter } from "@/types/shared";
import { Prisma, Product } from "@prisma/client";
import Decimal from "decimal.js";
const prisma = getPrisma();

export const fetchProductsByCompanyIdAction = async ({
  companyId,
  filter,
}: {
  companyId: string;
  filter: Filter & {
    price?: RangeType;
    dateRange?: DateRangeType;
  };
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

  if (filter) {
    if (filter.dateRange) {
      where = {
        OR: [
          {
            createdAt: {
              gte: filter.dateRange.startDate,
            },
          },
          {
            createdAt: {
              lte: filter.dateRange.endDate,
            },
          },
        ],
      };
    }
    if (filter.price) {
      if (filter.price.min) {
        where = {
          ProductPrice: {
            OR: [
              {
                unitPrice: {
                  gte: new Decimal(filter.price.min),
                },
              },
            ],
          },
        };
      }

      if (filter.price.min) {
        let valueDate = where.ProductPrice?.OR ?? [];
        where = {
          ProductPrice: {
            OR: [
              ...valueDate,
              {
                unitPrice: {
                  lte: new Decimal(filter.price.min),
                },
              },
            ],
          },
        };
      }
    }
  }

  return await prisma.product.findMany({
    where,
    take: limit,
    cursor: myCursor,
    orderBy: [
      {
        createdAt: orderBy,
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
