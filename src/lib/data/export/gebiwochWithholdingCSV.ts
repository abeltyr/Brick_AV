"use server";

import { fetchAllPurchases } from "../purchase/fetchAllPurchases";
import Decimal from "decimal.js";
import { stringify } from "csv-stringify/sync";
import { DateRangeType } from "@/types/shared";

type gebiwochWithholdingReport = {
  tin: string;
  name: string;
  withholdingNumber: string;
  date: string;
  totalTaxableAmount: string;
  withholding: string;
};

export const GebiwochWithHoldingCSV = async ({
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
      tin: `Withholdee TIN:(Not Mandatory)`,
      name: `Withholdee Full Name:(If Withholdee has TIN,Withholdee Full Name can be empty,otherwise it is mandatory)`,
      withholdingNumber: `Receipt No: (Mandatory)`,
      date: `Withhold Date: (Mandatory)`,
      totalTaxableAmount: `Totol Taxable Amount: (Mandatory)`,
      withholding: `Tax Withheld:(Mandatory)`,
    };

    let arrayData: gebiwochWithholdingReport[] = [];

    // for (const purchase of purchases) {
    //   arrayData = [
    //     ...arrayData,
    //     {
    //       tin: purchase.vendorTin ?? "",
    //       name: purchase.vendorTin ? "" : purchase.vendorName ?? "",
    //       withholdingNumber: purchase.withholdingNumber ?? "",
    //       date: purchase.date.toLocaleDateString("en-GB"),
    //       totalTaxableAmount: new Decimal(purchase.localGoodSummaryAmount)
    //         .plus(
    //           new Decimal(purchase.importedGoodSummaryAmount).plus(
    //             new Decimal(purchase.serviceSummaryAmount),
    //           ),
    //         )
    //         .toString(),
    //       withholding: purchase.withholding.toString(),
    //     },
    //   ];
    // }

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
