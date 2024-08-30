import { Gender } from "@prisma/client";

export interface ProfileInputType {
  name?: string;
  preferredName?: string;
  companyName?: string;
  companyLegalName?: string;
  email?: string;
  phoneNumber?: string;
  gender?: Gender;
  dateBirth?: string;
  tinNumber?: string;
  vatNumber?: string;
}

export interface AddressInputType {
  region?: string;
  city?: string;
  woreda?: string;
  houseNumber?: string;
  description?: string;
}
