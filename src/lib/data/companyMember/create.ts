"use server";

import { getPrisma } from "@/lib/utils/database";
import { CompanyMemberInputType } from "@/types/company";
import { CompanyMember } from "@prisma/client";
const prisma = getPrisma();

export const createCompanyMemberAction = async (
  data: CompanyMemberInputType,
): Promise<CompanyMember> => {
  return await prisma.companyMember.create({
    data: {
      ...data,
    },
    include: {
      profile: true,
      company: true,
    },
  });
};
