"use server";

import { getPrisma } from "@/lib/utils/database";
import { CompanyMemberType } from "@/types/company";
import { CompanyMemberRole } from "@prisma/client";
const prisma = getPrisma();

export async function updateCompanyMemberAction({
  id,
  data,
}: {
  id: string;
  data: {
    role?: CompanyMemberRole;
    active?: boolean;
  };
}): Promise<CompanyMemberType> {
  const companyMember = await prisma.companyMember.update({
    where: {
      id,
    },
    data: {
      ...data,
    },
  });
  return companyMember;
}
