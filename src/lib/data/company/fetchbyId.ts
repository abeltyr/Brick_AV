"use server";

import { getPrisma } from "@/lib/utils/database";
const prisma = getPrisma();

export async function getCompanyByIdAction({ id }: { id: string }) {
  return await prisma.company.findUnique({
    where: {
      id,
    },
  });
}
