"use server";

import { getPrisma } from "@/lib/utils/database";
import { Address } from "@prisma/client";
const prisma = getPrisma();

export const findAddressByIdAction = async (
  id: string,
): Promise<Address | null> => {
  return await prisma.address.findUnique({
    where: { id },
  });
};
