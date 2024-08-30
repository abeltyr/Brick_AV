import { Product, ProductPrice } from "@prisma/client";

export type ProductType = Product & {
  productPrice?: ProductPrice;
};
