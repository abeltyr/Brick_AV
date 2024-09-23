"use server";

import { getPrisma } from "@/lib/utils/database";
import { BusinessType } from "@/types/business";
import { BusinessLegalCondition, Prisma } from "@prisma/client";
import axios from "axios";
import { BusinessIncludeData } from "./common/include";
const prisma = getPrisma();

export const fetchBusinessApi = async (
  tinNumber: string,
): Promise<BusinessType> => {
  try {
    const business = await prisma.business.findUnique({
      where: { tinNumber },
      include: BusinessIncludeData,
    });

    if (
      business &&
      new Date(business.createdAt).getTime() >
        new Date().getTime() - 30 * 24 * 60 * 60 * 1000
    ) {
      console.log("old fetch");
      return business as BusinessType;
    }

    const businessResponse = await axios({
      method: "get",
      url: `https://etrade.gov.et/api/Registration/GetRegistrationInfoByTin/${tinNumber}/en`,
      headers: {
        Host: "etrade.gov.et",
        Referer: `https://etrade.gov.et/business-license-checker?tin=${tinNumber}`,
      },
    });

    const businessData = businessResponse.data;

    // Create the main business entity
    let businessTrade: Prisma.BusinessTradeCreateManyBusinessInput[] = [];

    let address = {
      region: null,
      zone: null,
      woreda: null,
      kebele: null,
      houseNumber: null,
    };
    // // Iterate through each business trade and create records
    for (const trade of businessData.Businesses.reverse()) {
      if (address.region === null || address.woreda) {
        const tradeResponse = await axios({
          method: "get",
          url: `https://etrade.gov.et/api/BusinessMain/GetBusinessByLicenseNo?LicenseNo=${trade.LicenceNumber}&Tin=null&Lang=en`,
          headers: {
            Host: "etrade.gov.et",
            Referer: `https://etrade.gov.et/business-license-checker?tin=${tinNumber}`,
          },
        });

        const tradeData = tradeResponse.data;

        address = {
          region: tradeData.AddressInfo.Region,
          zone: tradeData.AddressInfo.Zone,
          woreda: tradeData.AddressInfo.Woreda,
          kebele: tradeData.AddressInfo.Kebele,
          houseNumber: tradeData.AddressInfo.HouseNo,
        };
      }
      // Create the business trade record
      businessTrade = [
        ...businessTrade,
        {
          dateRegistered: new Date(trade.DateRegistered),
          tradeName: trade.TradesName,
          tradeNameAmh: trade.TradeNameAmh,
          licenseNumber: trade.LicenceNumber,
          RenewedTo: !isNaN(new Date(trade.RenewedTo).getTime())
            ? new Date(trade.RenewedTo)
            : "",
          RenewedFrom: !isNaN(new Date(trade.RenewedFrom).getTime())
            ? new Date(trade.RenewedFrom)
            : "",
          RenewalDate: !isNaN(new Date(trade.RenewalDate).getTime())
            ? new Date(trade.RenewalDate)
            : "",
          licenseName:
            trade.SubGroups.length > 0 ? trade.SubGroups[0].Description : "",
          licenseCode:
            trade.SubGroups.length > 0
              ? trade.SubGroups[0].Code.toString()
              : "",
          // trade.[0]?.BGroup.toString(), // Assuming you want to store the BGroup as licenseName
        },
      ];
    }

    const newBusiness = await prisma.business.upsert({
      where: {
        tinNumber: businessData.Tin,
      },
      update: {
        paidUpCapital: businessData.PaidUpCapital,
        managerName: businessData.AssociateShortInfos[0]?.ManagerName,
        managerNameEng: businessData.AssociateShortInfos[0]?.ManagerNameEng,
        address: {
          create: address,
        },
        BusinessTrade: {
          createMany: {
            data: businessTrade,
            skipDuplicates: true,
          },
        },
      },
      create: {
        tinNumber: businessData.Tin,
        legalCondition: getBusinessLegalCondition(businessData.LegalCondtion),
        registrationNo: businessData.RegNo,
        dateRegistered: new Date(businessData.RegDate),
        businessName: businessData.BusinessName,
        businessNameAmh: businessData.BusinessNameAmh,
        paidUpCapital: businessData.PaidUpCapital,
        managerName: businessData.AssociateShortInfos[0]?.ManagerName,
        managerNameEng: businessData.AssociateShortInfos[0]?.ManagerNameEng,
        phoneNumber: businessData.AssociateShortInfos[0]?.MobilePhone,
        phoneNumberAlterative:
          businessData.AssociateShortInfos[0]?.RegularPhone,
        address: {
          create: address,
        },
        BusinessTrade: {
          createMany: {
            data: businessTrade,
            skipDuplicates: true,
          },
        },
      },
      include: BusinessIncludeData,
    });

    return newBusiness as BusinessType;
  } catch (e) {
    console.log(e);
    throw new Error();
  }
};

const getBusinessLegalCondition = (
  legalCondition: string,
): BusinessLegalCondition => {
  switch (legalCondition) {
    case "1":
      return BusinessLegalCondition.SoleProprietorship;
    case "2":
      return BusinessLegalCondition.PrivateLimitedCompany;
    case "3":
      return BusinessLegalCondition.ShareCompany;
    case "4":
      return BusinessLegalCondition.ForeignBranch;
    case "5":
      return BusinessLegalCondition.PublicEnterprise;
    // ... other cases
    default:
      return BusinessLegalCondition.Other;
  }
};
