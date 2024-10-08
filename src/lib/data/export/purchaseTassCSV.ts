"use server";

import { fetchAllPurchases } from "../purchase/fetchAllPurchases";
import { stringify } from "csv-stringify/sync";
import { DateRangeType } from "@/types/shared";

type PurchaseEtaxReport = {
  vendorTin: string;
  grossAmount: string;
  receiptNumber: string;
  date: string;
  calendar: string;
  mrcNumber: string;
};

export const PurchaseTassCsvGenerator = async ({
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
        fetch: "vat",
      },
    });

    const columnTitles: { [key: string]: string } = {
      vendorTin: `Seller TIN`,
      grossAmount: `Amount paid`,
      receiptNumber: `Receipt Number`,
      date: `Receipt date`,
      calendar: `calader type(G or E`,
      mrcNumber: `MRC (10 Digit)`,
    };

    const arrayData: PurchaseEtaxReport[] = purchases.map((purchase) => ({
      vendorTin: purchase.vendorTin ?? "",
      grossAmount: purchase.grossAmount.toFixed(2),
      receiptNumber: purchase.receiptNumber ?? "",
      date: purchase.date.toLocaleDateString("en-GB"),
      calendar: "G",
      mrcNumber: purchase.mrcNumber ?? "",
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
