import { PrismaClient } from "@prisma/client";

export const runSetupSeed = async (prisma: PrismaClient) => {
  // const company = await prisma.company.create({
  //   data: {
  //     legalName: "eurka",
  //     name: "Eurka",
  //   },
  // });
  // const user = await prisma.user.create({
  //   data: {
  //     email: "abel@texly.co",
  //     name: "Abel",
  //     id: "74387e66-0125-484c-a7be-21a6a3992ab3",
  //   },
  // });
  // const companyUser = await prisma.companyUser.create({
  //   data: {
  //     userId: "74387e66-0125-484c-a7be-21a6a3992ab3",
  //     companyId: company.id,
  //     role: "Owner",
  //   },
  // });
  // const company = await prisma.contractorPayroll.findMany({
  //   where: {
  //     contractor:{
  //      companyId:id
  //     }
  //   },
  // });
};
