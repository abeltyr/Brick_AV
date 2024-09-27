"use server";

import { getPrisma } from "@/lib/utils/database";
import { limitSetter } from "@/lib/utils/limiter";
import { DateRangeType, RangeType } from "@/types/shared";
import { Filter } from "@/types/shared";
import { Prisma, Product } from "@prisma/client";
import Decimal from "decimal.js";
import { productIncludeData } from "./common/include";
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
    //date rage filter
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
    //price rage filter
    if (filter.price) {
      if (filter.price.min) {
        where = {
          inventory: {
            every: {
              productPrice: {
                every: {
                  OR: [
                    {
                      unitPrice: {
                        gte: new Decimal(filter.price.min),
                      },
                    },
                  ],
                },
              },
            },
          },
        };
      }

      if (filter.price.max) {
        let valueDate: Prisma.ProductPriceWhereInput[] = [];
        if (
          where.inventory &&
          where.inventory.every &&
          where.inventory.every.productPrice &&
          where.inventory.every.productPrice.every &&
          where.inventory.every.productPrice.every.OR
        ) {
          valueDate = where.inventory.every.productPrice.every.OR;
        }
        where = {
          inventory: {
            every: {
              productPrice: {
                every: {
                  OR: [
                    ...valueDate,
                    {
                      unitPrice: {
                        lte: new Decimal(filter.price.max),
                      },
                    },
                  ],
                },
              },
            },
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
    include: productIncludeData,
  });
};
