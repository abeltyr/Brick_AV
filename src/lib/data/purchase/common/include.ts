import { vendorIncludeData } from "../../vendor/common/include";

export const purchaseIncludeData = {
  chartOfAccount: true,
  chartOfAccountTransaction: true,
  purchaseProducts: {
    include: {
      inventory: {
        include: {
          product: true,
          ProductPrice: true,
        },
      },
    },
  },
  vendor: {
    include: vendorIncludeData,
  },
};
