"use server";

import { getPrisma } from "@/lib/utils/database";
import { CompanyInputType } from "@/types/company";
import { Company } from "@prisma/client";
const prisma = getPrisma();

export const createCompanyAction = async (
  data: CompanyInputType,
): Promise<Company> => {
  return await prisma.company.create({
    data: {
      ...data,
    },
  });
};
