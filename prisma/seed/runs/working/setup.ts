import { PrismaClient } from "@prisma/client";

export const runSetupSeed = async (prisma: PrismaClient) => {
  // const company = await prisma.company.create({
  //   data: {
  //     name: "Eurka",
  //     email: "",
  //     phoneNumber: "",
  //   },
  // });
  // const texlyCompany = await prisma.company.create({
  //   data: {
  //     name: "texly",
  //     email: "",
  //     phoneNumber: "",
  //   },
  // });

  // const nivorCompany = await prisma.company.create({
  //   data: {
  //     name: "nivor",
  //     email: "",
  //     phoneNumber: "",
  //   },
  // });
  // const user = await prisma.profile.create({
  //   data: {
  //     id: "e40fbc07-c963-444b-bbb6-306b4b2585f3",
  //     email: "abel@tecly.co",
  //     name: "Abel",
  //   },
  // });
  // await prisma.companyMember.create({
  //   data: {
  //     profileId: user.id,
  //     companyId: company.id,
  //     role: "Owner",
  //   },
  // });

  // await prisma.companyMember.create({
  //   data: {
  //     profileId: user.id,
  //     companyId: texlyCompany.id,
  //     role: "Owner",
  //   },
  // });

  // await prisma.companyMember.create({
  //   data: {
  //     profileId: user.id,
  //     companyId: nivorCompany.id,
  //     role: "Accountant",
  //   },
  // });

  const financialPeriod = await prisma.financialPeriod.create({
    data: {
      startDate: new Date("08/07/2024"),
      endDate: new Date("08/07/2025"),
      year: 2024,
      companyId: "1d96599f-0e7e-486a-95e0-5aec3d394f6a",
    },
  });

  const chartOfAccount = [
    prisma.chartOfAccount.create({
      data: {
        accountType: "Cash",
        code: "1000",
        type: "ASSET",
        companyId: "1d96599f-0e7e-486a-95e0-5aec3d394f6a",
        name: "CBE Bank",
        ChartOfAccountBalance: {
          create: {
            periodId: financialPeriod.id,
            balance: 100000,
            initialBalance: 100000,
          },
        },
        ChartOfAccountTransaction: {
          create: {
            transactionType: "DEPOSIT",
            companyId: "1d96599f-0e7e-486a-95e0-5aec3d394f6a",
            credit: 100000,
            date: new Date("08/07/2024"),
          },
        },
      },
    }),

    prisma.chartOfAccount.create({
      data: {
        accountType: "Cash",
        code: "1001",
        type: "ASSET",
        companyId: "1d96599f-0e7e-486a-95e0-5aec3d394f6a",
        name: "Zemen Bank",
        ChartOfAccountBalance: {
          create: {
            periodId: financialPeriod.id,
            balance: 100000,
            initialBalance: 100000,
          },
        },
        ChartOfAccountTransaction: {
          create: {
            transactionType: "DEPOSIT",
            companyId: "1d96599f-0e7e-486a-95e0-5aec3d394f6a",
            credit: 100000,
            date: new Date("08/07/2024"),
          },
        },
      },
    }),

    prisma.chartOfAccount.create({
      data: {
        accountType: "Account_payable",
        code: "1010",
        type: "ASSET",
        companyId: "1d96599f-0e7e-486a-95e0-5aec3d394f6a",
        name: "Vat payable",
        ChartOfAccountBalance: {
          create: {
            periodId: financialPeriod.id,
            balance: 0,
            initialBalance: 0,
          },
        },
      },
    }),
    prisma.chartOfAccount.create({
      data: {
        accountType: "Account_receivable",
        code: "3010",
        type: "LIABILITY",
        companyId: "1d96599f-0e7e-486a-95e0-5aec3d394f6a",
        name: "Vat receivable",
        ChartOfAccountBalance: {
          create: {
            periodId: financialPeriod.id,
            balance: 0,
            initialBalance: 0,
          },
        },
      },
    }),
    prisma.chartOfAccount.create({
      data: {
        accountType: "Account_payable",
        code: "1030",
        type: "ASSET",
        companyId: "1d96599f-0e7e-486a-95e0-5aec3d394f6a",
        name: "Withholding payable",
        ChartOfAccountBalance: {
          create: {
            periodId: financialPeriod.id,
            balance: 0,
            initialBalance: 0,
          },
        },
      },
    }),
    prisma.chartOfAccount.create({
      data: {
        accountType: "Account_receivable",
        code: "3020",
        type: "LIABILITY",
        companyId: "1d96599f-0e7e-486a-95e0-5aec3d394f6a",
        name: "Withholding receivable",
        ChartOfAccountBalance: {
          create: {
            periodId: financialPeriod.id,
            balance: 0,
            initialBalance: 0,
          },
        },
      },
    }),
  ];

  const data = await prisma.$transaction([...chartOfAccount]);

  // const company = await prisma.contractorPayroll.findMany({
  //   where: {
  //     contractor:{
  //      companyId:id
  //     }
  //   },
  // });
};
