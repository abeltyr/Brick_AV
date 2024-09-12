import { vendorIncludeData } from "../../vendor/common/include";

export const purchaseIncludeData = {
  PurchaseProduct: {
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
