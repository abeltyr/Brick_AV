import { Company, CompanyMember, Profile } from "@prisma/client";

export type CompanyMemberIndex = CompanyMember & {
  company?: Company;
  profile?: Profile;
};
