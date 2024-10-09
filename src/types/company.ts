import {
  Company,
  CompanyMember,
  CompanyMemberRole,
  File,
  FiscalYear,
} from "@prisma/client";
import { BusinessType } from "./business";
import { ProfileType } from "./profile";

export type CompanyType = Company & {
  business?: BusinessType;
  logo?: File;
  companyMember?: CompanyMember[];
  fiscalYear?: FiscalYear[];
};

export type CompanyMemberType = CompanyMember & {
  company?: CompanyType;
  profile?: ProfileType;
};

export type CompanyInputType = {
  name: string;
  managerName?: string;
  email?: string;
  phoneNumber?: string;
  phoneNumberAlterative?: string;
  description?: string;
  logoId?: string;
  businessId?: string;
};

export type CompanyMemberInputType = {
  profileId: string;
  companyId: string;
  role: CompanyMemberRole;
};
