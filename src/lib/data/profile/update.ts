"use server";

import { getPrisma } from "@/lib/utils/database";
import { ProfileType } from "@/types/general";
import { Profile } from "@prisma/client";

const prisma = getPrisma();

export const updateProfileAction = async (
  id: string,
  data: {
    profile?: ProfileType;
  },
): Promise<Profile> => {
  return await prisma.profile.update({
    where: { id },
    data: {
      ...data.profile,
    },
  });
};
