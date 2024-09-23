import { Decimal } from "@prisma/client/runtime/library";

export type PurchaseReportType = {
  count: number | null;
  grossAmount: Decimal | null;
  vatAmount: Decimal | null;
  totalBeforeTax: Decimal | null;
  nonTaxableAmount: Decimal | null;
  taxableAmount: Decimal | null;
  withholdingAmount: Decimal | null;
  totAmount: Decimal | null;
};
