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
  console.log("data.role ", data.role);
  let roleData: CompanyMemberRole = "Owner";

  if (data.role === "accountant") roleData = "Accountant";
  else if (data.role === "owner") roleData = "Owner";
  else roleData = "Other";

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
        companyMember: {
          create: {
            company: {
              create: {
                id: companyId,
                name: data.company.name,
                managerName: data.company.managerName,
                email: data.company.email,
                phoneNumber: data.company.phoneNumber,
                phoneNumberAlterative: data.company.phoneNumberAlterative,
                business: {
                  connect: {
                    id: data.company.businessId,
                  },
                },
              },
            },
            role: roleData,
            roleDetail: data.roleDetail,
          },
        },
      },
      include: {
        address: true,
        companyMember: {
          include: {
            company: {
              include: {
                business: {
                  include: {
                    businessTrade: true,
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
          companyMember: {
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
