import { Address, Profile } from "@prisma/client";

export type ProfileType = Profile & {
  address?: Address;
};
