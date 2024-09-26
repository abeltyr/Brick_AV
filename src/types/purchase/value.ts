import {
  Purchase,
  PurchaseProduct,
  VatDetail,
  TotDetail,
  WithholdingDetail,
  ChartOfAccount,
  ChartOfAccountTransaction,
  ChartOfAccountBalance,
  ChartOfAccountsCategoryType,
  ChartOfAccountsType,
} from "@prisma/client";
import { ProductType } from "../product";
import { VendorType } from "../vendor";
import { CompanyType } from "../company";
import { ProfileType } from "../profile";

export type PurchaseType = Purchase & {
  PurchaseProduct?: PurchaseProductType[];
  vendor?: VendorType;
  vatDetail?: VatDetailType;
  totDetail?: TotDetailType;
  withholdingDetail?: WithholdingDetailType;
};

export type PurchaseProductType = PurchaseProduct & {
  product?: ProductType;
};

export type VatDetailType = VatDetail & {
  chartOfAccount?: ChartOfAccountType;
  chartOfAccountTransaction?: ChartOfAccountTransactionType;
};

export type TotDetailType = TotDetail & {
  chartOfAccount?: ChartOfAccountType;
  chartOfAccountTransaction?: ChartOfAccountTransactionType;
};

export type WithholdingDetailType = WithholdingDetail & {
  chartOfAccount?: ChartOfAccountType;
  chartOfAccountTransaction?: ChartOfAccountTransactionType;
};

export type ChartOfAccountType = ChartOfAccount & {
  company?: CompanyType;
  createdBy?: ProfileType;
  chartOfAccountBalance?: ChartOfAccountBalance;
};

export type ChartOfAccountTransactionType = ChartOfAccountTransaction & {
  company?: CompanyType;
  createdBy?: ProfileType;
  chartOfAccount?: ChartOfAccountType;
};

export type ChartOfAccountInputType = {
  name: string;
  code: string;
  accountType: ChartOfAccountsCategoryType;
  type: ChartOfAccountsType;
  balanceType: "credit" | "debit";
  amount: number;
};

export type ChartOfAccountTransactionInputType = {
  companyId: string;
  chartOfAccountId: string;
  amount: number;
  date: Date;
  description?: string;
  type: ChartOfAccountTransactionType;
};
