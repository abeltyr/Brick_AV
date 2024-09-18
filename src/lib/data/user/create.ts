"use server";

import { getPrisma } from "@/lib/utils/database";
import { CompanyInputType } from "@/types/company";
import { ProfileInputType, ProfileType } from "@/types/profile";
import { CompanyMemberRole } from "@prisma/client";
import { v4 } from "uuid";
const prisma = getPrisma();

export const onBoardingAction = async (data: {
  profile: ProfileInputType;
  company: CompanyInputType;
  ownerProfile?: ProfileInputType;
  role: string;
  roleDetail?: string;
}): Promise<ProfileType> => {
  let roleData: CompanyMemberRole = "Owner";

  if (data.role === "Accountant") roleData = "Accountant";
  else if (data.role === "Other") roleData = "Other";

  const companyId = v4();
  let profileData: any[] = [
    prisma.profile.create({
      data: {
        userId: data.profile.userId,
        dateBirth: data.profile.dateBirth,
        email: data.profile.email,
        gender: data.profile.gender,
        name: data.profile.name,
        phoneNumber: data.profile.phoneNumber,
        tinNumber: data.profile.tinNumber,
        address: {
          create: {
            ...data.profile.address,
          },
        },
        CompanyMember: {
          create: {
            company: {
              create: {
                id: companyId,
                ...data.company,
              },
            },
            role: roleData,
            roleDetail: data.roleDetail,
          },
        },
      },
      include: {
        address: true,
        CompanyMember: {
          include: {
            company: {
              include: {
                business: {
                  include: {
                    BusinessTrade: true,
                  },
                },
              },
            },
          },
        },
      },
    }),
  ];

  if (roleData != "Owner" && data.ownerProfile) {
    profileData = [
      ...profileData,
      prisma.profile.create({
        data: {
          dateBirth: data.ownerProfile.dateBirth,
          email: data.ownerProfile.email,
          gender: data.ownerProfile.gender,
          name: data.ownerProfile.name,
          phoneNumber: data.ownerProfile.phoneNumber,
          tinNumber: data.ownerProfile.tinNumber,
          address: {
            create: {
              ...data.ownerProfile.address,
            },
          },
          CompanyMember: {
            create: {
              company: {
                connect: {
                  id: companyId,
                },
              },
              role: "Owner",
            },
          },
        },
      }),
    ];
  }

  const [profile, ownerProfile] = await prisma.$transaction([...profileData]);

  return profile as ProfileType;
};
