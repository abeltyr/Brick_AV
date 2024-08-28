"use server";

import { getPrisma } from "@/lib/utils/database";
import { Vendor } from "@prisma/client";
const prisma = getPrisma();

export const findVendorsByCompanyIdAction = async (
  companyId: string,
): Promise<Vendor[]> => {
  return await prisma.vendor.findMany({
    where: { companyId },
    include: {
      profile: {
        include: {
          address: true,
        },
      },
    },
  });
};
