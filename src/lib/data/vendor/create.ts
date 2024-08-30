"use server";

import { getPrisma } from "@/lib/utils/database";
import { AddressType, ProfileType } from "@/types/general";
import { Vendor } from "@prisma/client";

const prisma = getPrisma();

export const createVenderAction = async (data: {
  profile: ProfileType;
  address: AddressType;
  companyId: string;
}): Promise<Vendor> => {
  return await prisma.vendor.create({
    data: {
      profile: {
        create: {
          ...data.profile,
          address: {
            create: {
              ...data.address,
            },
          },
        },
      },
      company: {
        connect: {
          id: data.companyId,
        },
      },
    },
  });
};
