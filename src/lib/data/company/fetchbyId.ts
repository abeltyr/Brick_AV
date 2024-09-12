"use server";

import { getPrisma } from "@/lib/utils/database";
const prisma = getPrisma();

export async function fetchCompanyByIdAction({ id }: { id: string }) {
  return await prisma.company.findUnique({
    where: {
      id,
    },
  });
}
