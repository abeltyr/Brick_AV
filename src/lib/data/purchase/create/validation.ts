import { getPrisma } from "@/lib/utils/database";
import { vendorIncludeData } from "../../vendor/common/include";
import { VendorType } from "@/types/vendor";

const prisma = getPrisma();

export const createPurchaseValidation = async ({
  vendorId,
  fiscalYearId,
  date,
}: {
  vendorId: string;
  fiscalYearId: string;
  date: Date;
}) => {
  // fetch the vendor and accounting period to validate and setup the needed data
  const [vendorData, accountPeriods] = await prisma.$transaction([
    prisma.vendor.findUnique({
      where: { id: vendorId },
      include: vendorIncludeData,
    }),
    prisma.accountPeriod.findMany({
      where: {
        fiscalYearId: fiscalYearId,
        startDate: {
          lte: date,
        },
        endDate: {
          gte: date,
        },
      },
    }),
  ]);

  const vendor = vendorData as VendorType;
  if (!vendor) throw new Error("Vendor is no setup");
  if (accountPeriods && accountPeriods.length != 1)
    throw new Error("Account Period is not setup right");

  const accountPeriod = accountPeriods[0];

  return {
    vendor,
    accountPeriod,
  };
};
