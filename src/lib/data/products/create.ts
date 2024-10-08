"use server";

import { getPrisma } from "@/lib/utils/database";
import { generate8CharUUID } from "@/lib/utils/idGenerator";
import { ProductInputType, ProductType } from "@/types/product";
import { productIncludeData } from "./common/include";

const prisma = getPrisma();

export const createProductAction = async (
  data: ProductInputType,
): Promise<ProductType> => {
  const productCode = generate8CharUUID();

  const product = await prisma.product.create({
    data: {
      name: data.name,
      description: data.description,
      type: data.type,
      purchaseType: data.purchaseType,
      active: true,
      purchase: data.purchase,
      companyId: data.companyId,
      productCode: `${data.name.slice(0, 2).toUpperCase()}-${productCode}`,
      inventory: {
        create: {
          chartOfAccount: {
            connect: {
              id: data.chartOfAccountId,
            },
          },
          quantity: 0,
          productPrice: {
            create: {
              unit: data.unit,
              unitPrice: data.unitPrice,
              active: true,
            },
          },
        },
      },
    },
    include: productIncludeData,
  });

  return product as ProductType;
};
