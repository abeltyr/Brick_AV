"use server";

import { getPrisma } from "@/lib/utils/database";
import { BusinessType } from "@/types/business";
const prisma = getPrisma();

export const findAddressByIdAction = async (
  id: string,
): Promise<BusinessType | null> => {
  return (await prisma.business.findUnique({
    where: { id },
    include: {
      BusinessTrade: true,
      address: true,
      MRCRegistration: true,
    },
  })) as BusinessType;
};
