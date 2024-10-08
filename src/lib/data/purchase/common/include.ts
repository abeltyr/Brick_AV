import { vendorIncludeData } from "../../vendor/common/include";

export const purchaseIncludeData = {
  chartOfAccountTransaction: true,
  purchaseProducts: {
    include: {
      inventory: {
        include: {
          product: true,
          productPrice: true,
        },
      },
    },
  },
  vendor: {
    include: vendorIncludeData,
  },
};
