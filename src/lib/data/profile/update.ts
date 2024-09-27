"use server";

import { getPrisma } from "@/lib/utils/database";
import { UpdateProfileInputType } from "@/types/profile";
import { Profile } from "@prisma/client";
import { profileIncludeData } from "./common/include";

const prisma = getPrisma();

export const updateProfileAction = async (
  id: string,
  data: {
    profile?: UpdateProfileInputType;
  },
): Promise<Profile> => {
  return await prisma.profile.update({
    where: { id },
    data: {
      ...data.profile,
    },
    include: profileIncludeData,
  });
};
