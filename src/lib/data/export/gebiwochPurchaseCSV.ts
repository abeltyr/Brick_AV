"use server";

import { fetchAllPurchases } from "../purchase/fetchAllPurchases";
import Decimal from "decimal.js";
import { purchaseTypeConvertor } from "@/lib/form/product/data";
import { stringify } from "csv-stringify/sync";

type gebiwochPurchaseReport = {
  productType: string;
  calendar: string;
  purchaseType: number;
  vendorTin: string;
  sellerName: string;
  date: string;
  MRCNumber: string;
  VatReceiptNumber: string;
  description: string;
  unit: string;
  totalQuantity: string;
  averagePrice: string;
  totalValue: string;
  totalVat: string;
  grossAmount: string;
};

export const GebiwochPurchaseCSV = async ({
  month,
  year,
  companyId,
}: {
  year: number;
  month: number;
  companyId: string;
}) => {
  try {
    const purchases = await fetchAllPurchases({
      companyId,
      year,
      month,
      filter: {
        hasVat: true,
      },
    });

    const columnTitles: { [key: string]: string } = {
      productType: `VAT CATEGORY
 (G=GOODS;S=SERVICES)`,
      calender: `CALENDAR TYPE
(E=ETHIOPIAN;G=GREGORIAN)`,
      purchaseType: `Types of purchase.
1 = Taxable-local Purchase of Capital Assets (Line No. 65)
2 = Taxable-imported Purchase of Capital Assets (Line No. 75)
3 = Taxable-local Purchase of Inputs (Line No. 100)
4 = Taxable-imported Purchase of Inputs (Line No. 110)
5 = Taxable-general Expense Inputs Purchase (Line No. 120)
6= Tax Exempted-purchase with no vat or uncollectible inputs (Line no. 85 or Line no. 130) 

 (Please type 1 or 2 or 3 or 4 or 5 or 6).This field is mandatory.`,
      vendorTin: `TIN..This field
 is not mandatory.`,
      sellerName: `Seller name (if Seller has no TIN or item is not locally purchased)
This field is not mandatory.`,
      date: `Date of purchase/Customs Declaration No.
 Dispatched Date (Please use  dd/mm/yyyy date format). 
This field is mandatory.`,
      MRCNumber: `MRC Number..This field is mandatory.`,
      VatReceiptNumber: `Vat receipt number/ Customs Declaration Number.This field is mandatory.`,
      description: `Description.This field is mandatory.`,
      unit: `Unit of Measure (type ID 2-10).
2 KG
3 ML
4 GM
5 LIT
6 MT
7 PCS
8 CT
9 OTHER
10 PC
This field is mandatory.`,
      totalQuantity: `Quantity.
Enter number.Don't use comma (,) or Quatation ("")
This field is  mandatory.`,
      averagePrice: `Unit Price.
Enter number only .Don't use comma (,) or Quatation ("")
This field is  mandatory.`,
      totalValue: `Total value`,
      totalVat: `vat`,
      grossAmount: `value after vat`,
    };

    let arrayData: gebiwochPurchaseReport[] = [];

    for (const purchase of purchases) {
      arrayData = [
        ...arrayData,
        {
          productType: purchase.productType === "Good" ? "G" : "S",
          calendar: "G",
          purchaseType: purchaseTypeConvertor(purchase.purchaseType),
          vendorTin: purchase.vendorTin ?? "",
          sellerName: "",
          date: purchase.date.toLocaleDateString("en-GB"),
          MRCNumber: purchase.MRCNumber ?? "",
          VatReceiptNumber: purchase.VatReceiptNumber ?? "",
          description: purchase.description,
          unit: purchase.unit,
          totalQuantity: purchase.totalQuantity.toString(),
          averagePrice: purchase.averagePrice.toString(),
          totalValue: new Decimal(purchase.taxableAmount)
            .plus(new Decimal(purchase.nonTaxableAmount))
            .toString(),
          totalVat: purchase.totalVat.toString(),
          grossAmount: purchase.grossAmount.toString(),
        },
      ];
    }

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
