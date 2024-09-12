"use server";

import { getPrisma } from "@/lib/utils/database";
import { generate8CharUUID } from "@/lib/utils/idGenerator";
import { ProductInputType, ProductType } from "@/types/product";
import { includeData } from "./common/include";

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
      Inventory: {
        create: {
          quantity: 0,
          ProductPrice: {
            create: {
              unit: data.unit,
              unitPrice: data.unitPrice,
              active: true,
            },
          },
        },
      },
    },
    include: includeData,
  });

  return product as ProductType;
};
