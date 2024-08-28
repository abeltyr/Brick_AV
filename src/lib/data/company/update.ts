"use server";

import { getPrisma } from "@/lib/utils/database";
const prisma = getPrisma();

export async function updateCompany({ id }: { id: string }) {
  const companies = await prisma.company.update({
    where: {
      id,
    },
    data: {
      // addressId: "",
    },
  });
  return companies;
}
