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

  const financialPeriod = await prisma.fiscalYear.create({
    data: {
      startDate: new Date("08/07/2024"),
      endDate: new Date("08/07/2025"),
      year: 2024,
      companyId: "5d3fe461-8b94-4cc0-9d34-6999191fd86e",
    },
  });

  const accountPeriod = await prisma.accountPeriod.create({
    data: {
      startDate: new Date("08/07/2024"),
      endDate: new Date("08/08/2025"),
      fiscalYearId: financialPeriod.id,
    },
  });

  const chartOfAccount = [
    prisma.chartOfAccount.create({
      data: {
        accountType: "Cash",
        code: "1000",
        type: "ASSET",
        companyId: "5d3fe461-8b94-4cc0-9d34-6999191fd86e",
        name: "CBE Bank",
        chartOfAccountBalance: {
          create: {
            fiscalYearId: financialPeriod.id,
            balance: 100000,
            initialBalance: 100000,
          },
        },
        chartOfAccountTransaction: {
          create: {
            transactionType: "DEPOSIT",
            companyId: "5d3fe461-8b94-4cc0-9d34-6999191fd86e",
            credit: 100000,
            date: new Date("08/07/2024"),
            accountPeriodId: accountPeriod.id,
          },
        },
      },
    }),

    prisma.chartOfAccount.create({
      data: {
        accountType: "Cash",
        code: "1001",
        type: "ASSET",
        companyId: "5d3fe461-8b94-4cc0-9d34-6999191fd86e",
        name: "Zemen Bank",
        chartOfAccountBalance: {
          create: {
            fiscalYearId: financialPeriod.id,
            balance: 100000,
            initialBalance: 100000,
          },
        },
        chartOfAccountTransaction: {
          create: {
            transactionType: "DEPOSIT",
            companyId: "5d3fe461-8b94-4cc0-9d34-6999191fd86e",
            credit: 100000,
            date: new Date("08/07/2024"),
            accountPeriodId: accountPeriod.id,
          },
        },
      },
    }),

    prisma.chartOfAccount.create({
      data: {
        accountType: "Account_payable",
        code: "1010",
        type: "ASSET",
        companyId: "5d3fe461-8b94-4cc0-9d34-6999191fd86e",
        name: "Vat payable",
        chartOfAccountBalance: {
          create: {
            fiscalYearId: financialPeriod.id,
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
        companyId: "5d3fe461-8b94-4cc0-9d34-6999191fd86e",
        name: "Vat receivable",
        chartOfAccountBalance: {
          create: {
            fiscalYearId: financialPeriod.id,
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
        companyId: "5d3fe461-8b94-4cc0-9d34-6999191fd86e",
        name: "Withholding payable",
        chartOfAccountBalance: {
          create: {
            fiscalYearId: financialPeriod.id,
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
        companyId: "5d3fe461-8b94-4cc0-9d34-6999191fd86e",
        name: "Withholding receivable",
        chartOfAccountBalance: {
          create: {
            fiscalYearId: financialPeriod.id,
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
