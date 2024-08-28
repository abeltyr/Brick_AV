"use server";

import { getPrisma } from "@/lib/utils/database";
const prisma = getPrisma();

export async function getMemberCompanyAction(profileId: string) {
  return await prisma.companyMember.findMany({
    where: {
      profileId,
      active: true,
    },
    include: {
      company: true,
    },
  });
}
