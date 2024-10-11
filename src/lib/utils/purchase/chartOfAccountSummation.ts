import { ChartOfAccountDataType } from "@/lib/context/purchase/addPurchase";
import { PurchaseProductInput } from "@/types/purchase";
import { VendorType } from "@/types/vendor";
import Decimal from "decimal.js";

export const chartOfAccountSummation = ({
  purchaseProducts,
  vendor,
}: {
  purchaseProducts: PurchaseProductInput[];
  vendor: VendorType;
}) => {
  let chartOfAccountData: { [id: string]: ChartOfAccountDataType } = {};
  for (let data of purchaseProducts) {
    if (data.chartOfAccount) {
      let code = data.chartOfAccount.code;
      let quantity = data.quantity ?? 0;
      let unitPrice = data.unitPrice ?? 0;

      if (typeof quantity === "string") {
        quantity = 0;
      }
      if (typeof unitPrice === "string") {
        unitPrice = 0;
      }
      let amount =
        new Decimal(quantity).mul(new Decimal(unitPrice)) ?? new Decimal(0);

      if (vendor && vendor.taxType === "TOT") {
        if (data.type === "Good") {
          amount = amount.mul(1.02);
        } else {
          amount = amount.mul(1.1);
        }
      }
      if (
        amount &&
        chartOfAccountData[code] &&
        chartOfAccountData[code].amount
      ) {
        amount = new Decimal(chartOfAccountData[code].amount).plus(amount);
      }

      if (
        quantity &&
        chartOfAccountData[code] &&
        chartOfAccountData[code].quantity
      ) {
        quantity = new Decimal(chartOfAccountData[code].quantity)
          .plus(quantity)
          .toNumber();
      }

      chartOfAccountData[code] = {
        id: data.chartOfAccount.id,
        name: data.chartOfAccount.name,
        code: data.chartOfAccount.code,
        accountType: data.chartOfAccount.accountType,
        amount: amount.toNumber(),
        quantity,
        balance: data.chartOfAccount.balance,
      };
    }
  }

  return chartOfAccountData;
};
