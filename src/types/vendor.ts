import { Vendor, Company, File } from "@prisma/client";
import { BusinessType } from "./business";
import { PurchaseType } from "./purchase";

export type VendorType = Vendor & {
  company: Company;
  business?: BusinessType;
  logo?: File;
  Purchase: PurchaseType[];
};

export type VendorInputType = {
  companyId: string;
  businessId?: string;
  logoId?: string;
  name: string;
  vat?: string;
  contactName?: string;
  email?: string;
  phoneNumber?: string;
  description?: string;
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
