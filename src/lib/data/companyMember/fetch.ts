"use server";

import { getPrisma } from "@/lib/utils/database";
import { cache } from "react";
const prisma = getPrisma();

export const fetchMemberCompanyAction = cache(async (profileId: string) => {
  return await prisma.companyMember.findMany({
    where: {
      profileId,
      active: true,
    },
    include: {
      company: {
        include: {
          fiscalYear: {
            where: {
              status: "OPEN",
            },
          },
        },
      },
    },
  });
});

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
