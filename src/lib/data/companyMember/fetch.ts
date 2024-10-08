"use server";

import { getPrisma } from "@/lib/utils/database";
const prisma = getPrisma();

export async function fetchMemberCompanyAction(profileId: string) {
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

export async function fetchCompanyMemberAction(companyId: string) {
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
