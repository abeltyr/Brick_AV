"use server";

import { getPrisma } from "@/lib/utils/database";
import { PurchaseReportType } from "@/types/report";
import { DateRangeType } from "@/types/shared";

const prisma = getPrisma();

export const fetchDailyPurchaseReportAction = async ({
  companyId,
  date,
}: {
  companyId: string;
  date: DateRangeType;
}): Promise<PurchaseReportType | null> => {
  const weeklyReport = await prisma.purchaseDailyReport.aggregate({
    _sum: {
      count: true,
      grossAmount: true,
      vatAmount: true,
      totalAmount: true,
      nonTaxableAmount: true,
      taxableAmount: true,
      withholdingAmount: true,
      totAmount: true,
    },
    where: {
      companyId,
      date: {
        gte: new Date(date.startDate),
        lte: new Date(date.endDate),
      },
    },
  });

  console.log("weeklyReport", weeklyReport);
  if (weeklyReport) return weeklyReport._sum;
  else return null;
};

export const fetchMonthlyPurchaseReportAction = async ({
  companyId,
  year,
  month,
}: {
  companyId: string;
  year: {
    start: number;
    end: number;
  };
  month: {
    start: number;
    end: number;
  };
}): Promise<PurchaseReportType | null> => {
  const monthReport = await prisma.purchaseAccountPeriodReport.aggregate({
    _sum: {
      count: true,
      grossAmount: true,
      vatAmount: true,
      totalAmount: true,
      nonTaxableAmount: true,
      taxableAmount: true,
      withholdingAmount: true,
      totAmount: true,
    },
    where: {
      companyId,
    },
  });

  console.log("monthReport", monthReport);
  if (monthReport) return monthReport._sum;
  else return null;
};

export const fetchYearlyPurchaseReportAction = async ({
  companyId,
  year,
}: {
  companyId: string;
  year: {
    start: number;
    end: number;
  };
}): Promise<PurchaseReportType | null> => {
  const yearReport = await prisma.purchaseFiscalYearReport.aggregate({
    _sum: {
      count: true,
      grossAmount: true,
      vatAmount: true,
      totalAmount: true,
      nonTaxableAmount: true,
      taxableAmount: true,
      withholdingAmount: true,
      totAmount: true,
    },
    where: {
      companyId,
    },
  });

  console.log("yearReport", yearReport._sum.count);
  return null;
};
