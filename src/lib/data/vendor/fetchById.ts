"use server";

import { getPrisma } from "@/lib/utils/database";
import { Vendor } from "@prisma/client";
import { vendorIncludeData } from "./common/include";
const prisma = getPrisma();

export const findVendorByIdAction = async (
  id: string,
): Promise<Vendor | null> => {
  return await prisma.vendor.findUnique({
    where: { id },
    include: vendorIncludeData,
  });
};
