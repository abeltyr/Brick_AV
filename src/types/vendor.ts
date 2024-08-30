import { Company, Vendor, Profile, Purchase } from "@prisma/client";

export type VendorType = Vendor & {
  company?: Company;
  profile?: Profile;
  purchases?: Purchase[];
};
