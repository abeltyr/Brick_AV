"use server";

import { getPrisma } from "@/lib/utils/database";
import { Profile } from "@prisma/client";
const prisma = getPrisma();

export const findProfileByUserIdAction = async (
  id: string,
): Promise<Profile | null> => {
  return await prisma.profile.findUnique({
    where: { userId: id },
    include: {
      address: true,
      CompanyMember: {
        include: {
          company: true,
        },
      },
    },
  });
};
