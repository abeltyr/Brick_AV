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
  const profileId = v4();
  let chartOfAccountDataSet: Prisma.Prisma__ChartOfAccountClient<{}>[] = [];

  for (let accounts of data.chartOfAccounts.accounts) {
    const chartOfAccountData: Prisma.Prisma__ChartOfAccountClient<{}> =
      prisma.chartOfAccount.create({
        data: {
          accountType: accounts.accountType,
          code: accounts.code,
          name: accounts.name,
          balanceCreditBased:
            accountTypeObject[accounts.accountType].normal_balance === "credit",
          type: accountTypeObject[accounts.accountType].type,
          createdBy: { connect: { id: profileId } },
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
              creatorId: profileId,
            },
          },
        },
      });
    if (chartOfAccountData)
      chartOfAccountDataSet = [...chartOfAccountDataSet, chartOfAccountData];
  }

  console.log("fiscalYear", data.fiscalYear);

  const fiscalStartDate = new Date(data.fiscalYear.startDate);
  const fiscalEndDate = new Date(data.fiscalYear.endDate);

  fiscalStartDate.setHours(24, 0, 0, 0);
  fiscalEndDate.setHours(24, 0, 0, 0);

  // console.log({
  //   startDate: fiscalStartDate.toISOString().split("T")[0] + "T00:00:00.000Z",
  //   endDate: fiscalEndDate.toISOString().split("T")[0] + "T23:59:59.999Z",
  //   data: data.fiscalYear.periods.map((period, index) => {
  //     const start = period.start;
  //     const end = period.end;
  //     start.setHours(24, 0, 0, 0);
  //     end.setHours(24, 0, 0, 0);
  //     return {
  //       startDate: start.toISOString().split("T")[0] + "T00:00:00.000Z",
  //       endDate: end.toISOString().split("T")[0] + "T23:59:59.999Z",
  //       name: months[start.getMonth()] ? months[start.getMonth()].full : "",
  //       order: index,
  //     };
  //   }),
  // });

  // throw new Error();
  const [profile] = await prisma.$transaction([
    prisma.profile.create({
      data: {
        id: profileId,
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
        startDate:
          fiscalStartDate.toISOString().split("T")[0] + "T00:00:00.000Z",
        endDate: fiscalEndDate.toISOString().split("T")[0] + "T23:59:59.999Z",
        year: fiscalStartDate.getFullYear(),
        company: {
          connect: {
            id: companyId,
          },
        },
        accountPeriods: {
          createMany: {
            data: data.fiscalYear.periods.map((period, index) => {
              const start = period.start;
              const end = period.end;
              start.setHours(24, 0, 0, 0);
              end.setHours(24, 0, 0, 0);

              return {
                startDate: start.toISOString().split("T")[0] + "T00:00:00.000Z",
                endDate: end.toISOString().split("T")[0] + "T23:59:59.999Z",
                name: months[start.getMonth()]
                  ? months[start.getMonth()].full
                  : "",
                order: index,
              };
            }),
          },
        },
      },
    }),
    ...chartOfAccountDataSet,
  ]);

  return profile as ProfileType;
};
