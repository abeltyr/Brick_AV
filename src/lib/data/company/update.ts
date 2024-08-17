"use server";

import { getPrisma } from "@/lib/utils/database";
const prisma = getPrisma();

export async function updateCompany({ userName }: { userName: string }) {
  const companies = await prisma.company.update({
    where: {
      userName: userName,
    },
    data: {
      houseNumber: "",
      woreda: "",
      name: "",
      tin: "",
      region: "",
      vat: "",
    },
  });
  return companies;
}
