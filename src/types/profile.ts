import { Address, Profile } from "@prisma/client";
import { Gender } from "@prisma/client";
import { AddressInputType } from "./address";

export type ProfileType = Profile & {
  address?: Address;
};

export type ProfileInputType = {
  name: string;
  preferredName?: string;
  email?: string;
  phoneNumber?: string;
  gender?: Gender;
  dateBirth?: Date;
  tinNumber?: string;
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
  tinNumber?: string;
};
