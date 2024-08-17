"use server";

import { getPrisma } from "@/lib/utils/database";
const prisma = getPrisma();

export async function getCompanyAction({ userName }: { userName: string }) {
  const tag = await prisma.company.findUnique({
    where: {
      userName,
    },
  });
  return tag;
}
