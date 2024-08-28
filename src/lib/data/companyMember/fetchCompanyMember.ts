"use server";

import { getPrisma } from "@/lib/utils/database";
const prisma = getPrisma();

export async function getCompanyMemberAction(companyId: string) {
  return await prisma.companyMember.findMany({
    where: {
      companyId,
      active: true,
    },
    include: {
      profile: true,
    },
  });
}
