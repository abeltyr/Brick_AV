"use server";

import { getPrisma } from "@/lib/utils/database";
import { AddressType } from "@/types/general";
import { Address } from "@prisma/client";

const prisma = getPrisma();

export const updateAddressAction = async (
  id: string,
  data: AddressType,
): Promise<Address> => {
  return await prisma.address.update({
    where: { id },
    data: {
      ...data,
    },
  });
};
