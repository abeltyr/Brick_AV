"use server";

import { getPrisma } from "@/lib/utils/database";
const prisma = getPrisma();

export async function getUserCompanies({ userId }: { userId: string }) {
  const companies = await prisma.company.findMany({
    where: {
      companyUsers: {
        every: {
          userId: userId,
        },
      },
    },
  });
  return companies;
}
