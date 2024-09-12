import {
  Company,
  CompanyMember,
  CompanyMemberRole,
  File,
} from "@prisma/client";
import { BusinessType } from "./business";
import { ProfileType } from "./profile";

export type CompanyType = Company & {
  business?: BusinessType;
  logo?: File;
  companyMember?: CompanyMember[];
};

export type CompanyMemberType = CompanyMember & {
  company?: Company;
  profile?: ProfileType;
};

export type CompanyInputType = {
  name: string;
  managerName?: string;
  managerNameEng?: string;
  email?: string;
  phoneNumber?: string;
  description?: string;
  logoId?: string;
  businessId?: string;
};

export type CompanyMemberInputType = {
  profileId: string;
  companyId: string;
  role: CompanyMemberRole;
};
