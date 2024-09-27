import { Vendor, Company } from "@prisma/client";
import { BusinessType } from "./business";
import { PurchaseType } from "./purchase";

export type VendorType = Vendor & {
  company: Company;
  business?: BusinessType;
  purchase: PurchaseType[];
};

export type VendorInputType = {
  companyId: string;
  name: string;
  vat?: string;
  email?: string;
  phoneNumber?: string;
  description?: string;
  businessId?: string;
};

export type UpdateVendorInputType = {
  logoId?: string;
  vat?: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  description?: string;
};
