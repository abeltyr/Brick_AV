"use server";

import { getPrisma } from "@/lib/utils/database";
import { AddressInputType } from "@/types/address";
import { Address } from "@prisma/client";
const prisma = getPrisma();

export const createAddressAction = async (
  data: AddressInputType,
): Promise<Address> => {
  return await prisma.address.create({
    data: {
      ...data,
    },
  });
};
