"use server";

import { getPrisma } from "@/lib/utils/database";
const prisma = getPrisma();

export async function getCompanyByNameAction({
  legalName,
}: {
  legalName: string;
}) {
  return await prisma.company.findUnique({
    where: {
      legalName,
    },
  });
}
