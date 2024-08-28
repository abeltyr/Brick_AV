"use server";

import { getPrisma } from "@/lib/utils/database";
import { Profile } from "@prisma/client";
const prisma = getPrisma();

export const findProfileByIdAction = async (
  id: string,
): Promise<Profile | null> => {
  return await prisma.profile.findUnique({
    where: { id },
    include: {
      address: true,
    },
  });
};
