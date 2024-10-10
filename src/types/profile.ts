import { Address, Profile } from "@prisma/client";
import { Gender } from "@prisma/client";
import { AddressInputType } from "./address";
import { CompanyMemberType } from "./company";

export type ProfileType = Profile & {
  address?: Address;
  companyMember?: CompanyMemberType[];
};

export type ProfileInputType = {
  name: string;
  userId?: string;
  preferredName?: string;
  email: string;
  phoneNumber?: string;
  gender?: Gender;
  dateBirth?: Date;
  tin?: string;
  addressId?: string;
  address?: AddressInputType;
};

export type UpdateProfileInputType = {
  name: string;
  preferredName?: string;
  email?: string;
  phoneNumber?: string;
  gender?: Gender;
  dateBirth?: Date;
  tin?: string;
};
