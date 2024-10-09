"use server";

import yearSchema from "@/lib/form/account/accountPeriod";
import { chartOfAccountsSchema } from "@/lib/form/account/chartOfAccount";
import { months } from "@/lib/utils/calendar/date";
import { accountTypeObject } from "@/lib/utils/chartOfAccount/values";
import { getPrisma } from "@/lib/utils/database";
import { CompanyInputType } from "@/types/company";
import { ProfileInputType, ProfileType } from "@/types/profile";
import { CompanyMemberRole, Prisma } from "@prisma/client";
import { v4 } from "uuid";
import { z } from "zod";
const prisma = getPrisma();

export const onBoardingAction = async (data: {
  profile: ProfileInputType;
  company: CompanyInputType;
  fiscalYear: z.infer<typeof yearSchema>;
  chartOfAccounts: z.infer<typeof chartOfAccountsSchema>;
}): Promise<ProfileType> => {
  let roleData: CompanyMemberRole = "Accountant";

  const companyId = v4();
  const fiscalYearId = v4();
  let chartOfAccountDataSet: Prisma.Prisma__ChartOfAccountClient<{}>[] = [];

  for (let accounts of data.chartOfAccounts.accounts) {
    let createdBy = {};
    if (data.profile.userId)
      createdBy = { connect: { id: data.profile.userId } };
    const chartOfAccountData: Prisma.Prisma__ChartOfAccountClient<{}> =
      prisma.chartOfAccount.create({
        data: {
          accountType: accounts.accountType,
          code: accounts.code,
          name: accounts.name,
          balanceCreditBased:
            accountTypeObject[accounts.accountType].normal_balance === "credit",
          type: accountTypeObject[accounts.accountType].type,
          // createdBy: createdBy,
          company: {
            connect: {
              id: companyId,
            },
          },
          chartOfAccountBalance: {
            create: {
              balance: accounts.balance.amount,
              initialBalance: accounts.balance.amount,
              fiscalYearId,
            },
          },
        },
      });
    if (chartOfAccountData)
      chartOfAccountDataSet = [...chartOfAccountDataSet, chartOfAccountData];
  }

  const [profile] = await prisma.$transaction([
    prisma.profile.create({
      data: {
        userId: data.profile.userId,
        dateBirth: data.profile.dateBirth,
        email: data.profile.email,
        gender: data.profile.gender,
        name: data.profile.name,
        phoneNumber: data.profile.phoneNumber,
        tin: data.profile.tin,
        address: {
          create: {
            ...data.profile.address,
          },
        },
        companyMember: {
          create: {
            company: {
              create: {
                id: companyId,
                name: data.company.name,
                managerName: data.company.managerName,
                email: data.company.email,
                phoneNumber: data.company.phoneNumber,
                phoneNumberAlterative: data.company.phoneNumberAlterative,
                business: {
                  connect: {
                    id: data.company.businessId,
                  },
                },
              },
            },
            role: roleData,
          },
        },
      },
      include: {
        address: true,
        companyMember: {
          include: {
            company: {
              include: {
                business: {
                  include: {
                    businessTrade: true,
                  },
                },
              },
            },
          },
        },
      },
    }),
    prisma.fiscalYear.create({
      data: {
        id: fiscalYearId,
        startDate: data.fiscalYear.startDate,
        endDate: data.fiscalYear.endDate,
        year: data.fiscalYear.startDate.getFullYear(),
        company: {
          connect: {
            id: companyId,
          },
        },
        accountPeriods: {
          createMany: {
            data: data.fiscalYear.periods.map((period, index) => ({
              startDate: period.start,
              endDate: period.end,
              name: months[period.start.getMonth()]
                ? months[period.start.getMonth()].full
                : "",
              order: index,
            })),
          },
        },
      },
    }),
    ...chartOfAccountDataSet,
  ]);

  return profile as ProfileType;
};
