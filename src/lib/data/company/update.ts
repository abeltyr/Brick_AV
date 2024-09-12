"use server";

import { getPrisma } from "@/lib/utils/database";
import { CompanyInputType } from "@/types/company";
const prisma = getPrisma();

export async function updateCompany({
  id,
  data,
}: {
  id: string;
  data: CompanyInputType;
}) {
  const companies = await prisma.company.update({
    where: {
      id,
    },
    data,
  });
  return companies;
}
