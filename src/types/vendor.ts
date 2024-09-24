import { Vendor, Company } from "@prisma/client";
import { BusinessType } from "./business";
import { PurchaseType } from "./purchase";
import { ProfileInputType, ProfileType } from "./profile";

export type VendorType = Vendor & {
  company: Company;
  seller?: ProfileType;
  business?: BusinessType;
  Purchase: PurchaseType[];
};

export type VendorInputType = {
  companyId: string;
  name: string;
  description?: string;
  businessId?: string;
  vat?: string;
  seller?: ProfileInputType;
};

export type UpdateVendorInputType = {
  logoId?: string;
  name: string;
  vat?: string;
  contactName?: string;
  email?: string;
  phoneNumber?: string;
  description?: string;
};
