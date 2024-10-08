"use server";

import { fetchAllPurchases } from "../purchase/fetchAllPurchases";
import { stringify } from "csv-stringify/sync";
import { DateRangeType } from "@/types/shared";

type WithholdingEtaxCSVReport = {
  vendorTin: string;
  vendorName: string;
  withholdingNumber: string;
  date: string;
  taxableAmount: string;
  taxWithheld: string;
};

export const WithholdingEtaxCSVGenerator = async ({
  dateRange,
  companyId,
}: {
  dateRange: DateRangeType;
  companyId: string;
}) => {
  try {
    const purchases = await fetchAllPurchases({
      companyId,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      filter: {
        fetch: "withholding",
      },
    });

    const columnTitles: { [key: string]: string } = {
      vendorTin: `Withholdee TIN:(Not Mandatory)`,
      vendorName: `Withholdee Full Name:(If Withholdee has TIN,Withholdee Full Name can be empty,otherwise it is mandatory)`,
      withholdingNumber: `Receipt No: (Mandatory)`,
      date: `Withhold Date: (Mandatory)`,
      taxableAmount: `Totol Taxable Amount: (Mandatory)`,
      taxWithheld: `Tax Withheld:(Mandatory)`,
    };

    const arrayData: WithholdingEtaxCSVReport[] = purchases.map((purchase) => ({
      vendorTin: purchase.vendorTin ?? "",
      vendorName: purchase.vendorName ?? "",
      withholdingNumber: purchase.withholdingNumber ?? "",
      date: purchase.date.toLocaleDateString("en-GB"),
      taxableAmount: purchase.taxableAmount.toFixed(2),
      taxWithheld: purchase.withholdingAmount.toFixed(2),
    }));

    const data = Object.values(arrayData);
    const csv = stringify(data);

    const csvData = stringify([], {
      header: true,
      columns: Object.values(columnTitles),
    });

    return {
      success: true,
      data: `${csvData}${csv}`,
    };
  } catch (error) {
    console.error("Error generating CSV:", error);
    return { success: false, error: "Error generating CSV" };
  }
};
