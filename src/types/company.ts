import { Company, CompanyMember, Profile } from "@prisma/client";

export type CompanyMemberType = CompanyMember & {
  company?: Company;
  profile?: Profile;
};
