"use server";

import { getPrisma } from "@/lib/utils/database";
import { UpdateVendorInputType, VendorType } from "@/types/vendor";
import { vendorIncludeData } from "./common/include";

const prisma = getPrisma();

export const updateVendorAction = async (
  id: string,
  data: UpdateVendorInputType,
): Promise<VendorType> => {
  return (await prisma.vendor.update({
    where: { id },
    data: {
      ...data,
    },
    include: vendorIncludeData,
  })) as VendorType;
};
