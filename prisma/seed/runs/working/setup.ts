import { PrismaClient } from "@prisma/client";

export const runSetupSeed = async (prisma: PrismaClient) => {
  const company = await prisma.company.create({
    data: {
      name: "Eurka",
      email: "",
      phoneNumber: "",
    },
  });
  const texlyCompany = await prisma.company.create({
    data: {
      name: "texly",
      email: "",
      phoneNumber: "",
    },
  });

  const nivorCompany = await prisma.company.create({
    data: {
      name: "nivor",
      email: "",
      phoneNumber: "",
    },
  });
  const user = await prisma.profile.create({
    data: {
      id: "e40fbc07-c963-444b-bbb6-306b4b2585f3",
      email: "abel@tecly.co",
      name: "Abel",
    },
  });
  await prisma.companyMember.create({
    data: {
      profileId: user.id,
      companyId: company.id,
      role: "Owner",
    },
  });

  await prisma.companyMember.create({
    data: {
      profileId: user.id,
      companyId: texlyCompany.id,
      role: "Owner",
    },
  });

  await prisma.companyMember.create({
    data: {
      profileId: user.id,
      companyId: nivorCompany.id,
      role: "Accountant",
    },
  });

  // const company = await prisma.contractorPayroll.findMany({
  //   where: {
  //     contractor:{
  //      companyId:id
  //     }
  //   },
  // });
};
