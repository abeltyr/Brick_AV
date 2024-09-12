"use server";

import { getPrisma } from "@/lib/utils/database";
import { BusinessType } from "@/types/business";
import { BusinessLegalCondition, Prisma } from "@prisma/client";
import axios from "axios";
const prisma = getPrisma();

export const fetchBusinessApi = async (
  tinNumber: string,
): Promise<BusinessType> => {
  try {
    const businessResponse = await axios({
      method: "get",
      maxBodyLength: Infinity,
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
      HouseNo: null,
    };
    // Iterate through each business trade and create records
    for (const trade of businessData.Businesses) {
      const tradeResponse = await axios({
        method: "get",
        maxBodyLength: Infinity,
        url: `https://etrade.gov.et/api/BusinessMain/GetBusinessByLicenseNo?LicenseNo=${trade.LicenceNumber}&Tin=null&Lang=en`,
        headers: {
          Host: "etrade.gov.et",
        },
      });

      const tradeData = tradeResponse.data;
      if (address.region)
        address = {
          region: tradeData.AddressInfo.Region,
          zone: tradeData.AddressInfo.Zone,
          woreda: tradeData.AddressInfo.Woreda,
          kebele: tradeData.AddressInfo.Kebele,
          HouseNo: tradeData.AddressInfo.HouseNo,
        };

      // Create the business trade record
      businessTrade = [
        ...businessTrade,
        {
          dateRegistered: new Date(trade.DateRegistered),
          TradeName: trade.TradesName,
          TradeNameAmh: trade.TradeNameAmh,
          LicenseNumber: trade.LicenceNumber,
          RenewedTo: new Date(trade.RenewedTo),
          RenewedFrom: new Date(trade.RenewedFrom),
          RenewalDate: new Date(trade.RenewalDate),
          licenseName:
            tradeData.BusinessLicensingGroupMain[0]?.BGroup.toString(), // Assuming you want to store the BGroup as licenseName
        },
      ];
    }

    const newBusiness = await prisma.business.create({
      data: {
        tinNumber: businessData.Tin,
        legalCondition: getBusinessLegalCondition(businessData.LegalCondtion),
        registrationNo: businessData.RegNo,
        dateRegistered: new Date(businessData.RegDate),
        businessName: businessData.BusinessName,
        businessNameAmh: businessData.BusinessNameAmh,
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
    });

    return newBusiness as BusinessType;
  } catch (e) {
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
