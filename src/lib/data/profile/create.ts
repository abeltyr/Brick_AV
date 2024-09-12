"use server";

import { getPrisma } from "@/lib/utils/database";
import { ProfileInputType } from "@/types/profile";
import { Profile } from "@prisma/client";
const prisma = getPrisma();

export const createProfileAction = async (data: {
  profile: ProfileInputType;
}): Promise<Profile> => {
  const address = {
    create: {
      ...data.profile.address,
    },
  };

  return await prisma.profile.create({
    data: {
      dateBirth: data.profile.dateBirth,
      email: data.profile.email,
      gender: data.profile.gender,
      name: data.profile.name,
      phoneNumber: data.profile.phoneNumber,
      preferredName: data.profile.preferredName,
      tinNumber: data.profile.tinNumber,
      address,
    },
  });
};
