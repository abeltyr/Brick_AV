"use server";

import { fetchAllPurchases } from "../purchase/fetchAllPurchases";
import { stringify } from "csv-stringify/sync";
import { DateRangeType } from "@/types/shared";

type PurchaseLtoReport = {
  indexData: number;
  vendorName: string;
  vendorTin: string;
  servicePurchase: string;
  goodPurchase: string;
  vat: string;
  withholding: string;
  mrcNumber: string;
  receiptNumber: string;
  date: string;
};

export const PurchaseLtoCsvGenerator = async ({
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
      indexData: "S/No",
      vendorName: `Name of seller`,
      vendorTin: `TIN Number`,
      servicePurchase: `purchase of services
      /price`,
      goodPurchase: `purchase of goods
      /price`,
      vat: `Value Added Tax
      /VAT/`,
      withholding: `withholding`,
      mrcNumber: `Machine
      Registration 
      Code/MRC/`,
      receiptNumber: `Receipt 
      number`,
      date: `Receipt date
      (dd//mm//yyyy)`,
    };

    const arrayData: PurchaseLtoReport[] = purchases.map((purchase, index) => ({
      indexData: index + 1,
      vendorName: purchase.vendorName ?? "",
      vendorTin: purchase.vendorTin ?? "",
      servicePurchase: purchase.serviceSummaryAmount.toFixed(2),
      goodPurchase: purchase.goodSummaryAmount.toFixed(2),
      vat: purchase.taxAmount.toFixed(2),
      withholding: purchase.withholdingAmount.toFixed(2),
      mrcNumber: purchase.mrcNumber ?? "",
      receiptNumber: purchase.receiptNumber ?? "",
      date: purchase.date
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        .replace(/\//g, "-"),
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
