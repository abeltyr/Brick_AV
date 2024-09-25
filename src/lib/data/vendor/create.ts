"use server";

import { getPrisma } from "@/lib/utils/database";
import { VendorInputType } from "@/types/vendor";
import { Prisma, Vendor } from "@prisma/client";
import { vendorIncludeData } from "./common/include";

const prisma = getPrisma();

export const createVenderAction = async (
  data: VendorInputType,
): Promise<Vendor> => {
  let value: Prisma.VendorCreateInput = {
    name: data.name,
    vat: data.vat,
    email: data.email,
    phoneNumber: data.phoneNumber,
    description: data.description,
    company: {
      connect: {
        id: data.companyId,
      },
    },
  };

  if (data.businessId)
    value = {
      ...value,
      business: {
        connect: {
          id: data.businessId,
        },
      },
    };

  return await prisma.vendor.create({
    data: value,
    include: vendorIncludeData,
  });
};
