"use server";

import { getPrisma } from "@/lib/utils/database";
import { ProfileInputType } from "@/types/general";
import { Profile } from "@prisma/client";

const prisma = getPrisma();

export const updateProfileAction = async (
  id: string,
  data: {
    profile?: ProfileInputType;
  },
): Promise<Profile> => {
  return await prisma.profile.update({
    where: { id },
    data: {
      ...data.profile,
    },
  });
};
