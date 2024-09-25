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
      companyId: "a30c618e-fd82-40c0-84a5-cd2082724012",
    },
  });

  const chartOfAccount = [
    prisma.chartOfAccount.create({
      data: {
        category: "Cash",
        code: "1000",
        type: "ASSET",
        companyId: "a30c618e-fd82-40c0-84a5-cd2082724012",
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
            companyId: "a30c618e-fd82-40c0-84a5-cd2082724012",
            credit: 100000,
            date: new Date("08/07/2024"),
          },
        },
      },
    }),

    prisma.chartOfAccount.create({
      data: {
        category: "Cash",
        code: "1001",
        type: "ASSET",
        companyId: "a30c618e-fd82-40c0-84a5-cd2082724012",
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
            companyId: "a30c618e-fd82-40c0-84a5-cd2082724012",
            credit: 100000,
            date: new Date("08/07/2024"),
          },
        },
      },
    }),

    prisma.chartOfAccount.create({
      data: {
        category: "Account_payable",
        code: "1010",
        type: "ASSET",
        companyId: "a30c618e-fd82-40c0-84a5-cd2082724012",
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
        category: "Account_receivable",
        code: "3010",
        type: "LIABILITY",
        companyId: "a30c618e-fd82-40c0-84a5-cd2082724012",
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
        category: "Account_payable",
        code: "1030",
        type: "ASSET",
        companyId: "a30c618e-fd82-40c0-84a5-cd2082724012",
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
        category: "Account_receivable",
        code: "3020",
        type: "LIABILITY",
        companyId: "a30c618e-fd82-40c0-84a5-cd2082724012",
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
