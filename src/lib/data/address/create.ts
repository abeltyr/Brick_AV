"use server";

import { getPrisma } from "@/lib/utils/database";
import { AddressType } from "@/types/general";
import { Address } from "@prisma/client";
const prisma = getPrisma();

export const createAddressAction = async (
  data: AddressType,
): Promise<Address> => {
  return await prisma.address.create({
    data: {
      ...data,
    },
  });
};
