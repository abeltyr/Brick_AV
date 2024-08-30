import { Company, Vendor, Purchase } from "@prisma/client";
import { ProfileType } from "./profile";

export type VendorType = Vendor & {
  company?: Company;
  profile?: ProfileType;
  purchases?: Purchase[];
};
