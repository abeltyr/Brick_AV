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
  tradeName?: string;
  tradeNameAmh?: string;
  licenseNumber?: string;
  renewedTo?: Date;
  renewedFrom?: Date;
  renewalDate?: Date;
  licenseName: string;
  addressId?: string;
};

export type MRCRegistrationInputType = {
  mrcNumber: string;
  verified?: boolean;
};
