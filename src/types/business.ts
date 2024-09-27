import {
  Address,
  Business,
  BusinessLegalCondition,
  BusinessTrade,
  MRCRegistration,
} from "@prisma/client";

export type BusinessType = Business & {
  address?: Address;
  businessTrade: BusinessTradeType[];
  mrcRegistration: MRCRegistration[];
};

export type BusinessTradeType = BusinessTrade & {
  address?: Address;
};

export type MRCRegistrationType = MRCRegistration;

export type BusinessInputType = {
  tinNumber: string;
  legalCondition: BusinessLegalCondition;
  registrationNo?: string;
  dateRegistered?: Date;
  businessName?: string;
  businessNameAmh?: string;
  paidUpCapital?: number;
  managerName?: string;
  managerNameEng?: string;
  addressId?: string;
};

export type BusinessTradeInputType = {
  dateRegistered?: Date;
  TradeName?: string;
  TradeNameAmh?: string;
  LicenseNumber?: string;
  RenewedTo?: Date;
  RenewedFrom?: Date;
  RenewalDate?: Date;
  licenseName: string;
  addressId?: string;
};

export type MRCRegistrationInputType = {
  MRCNumber: string;
  verified?: boolean;
};
