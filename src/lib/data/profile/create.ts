"use server";

import { getPrisma } from "@/lib/utils/database";
import { AddressType, ProfileType } from "@/types/general";
import { Profile } from "@prisma/client";
const prisma = getPrisma();

export const createProfileAction = async (data: {
  profile: ProfileType;
  address: AddressType;
}): Promise<Profile> => {
  return await prisma.profile.create({
    data: {
      ...data.profile,
      address: {
        create: {
          ...data.address,
        },
      },
    },
  });
};
