import {
  zProductInputType,
  zProductInputUnit,
  zPurchaseInputType,
} from "@/lib/form/product/data";
import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, {
    message: "A valid name with at least two words is needed",
  }),
  description: z.string().optional(),
  type: zProductInputType,
  purchaseType: zPurchaseInputType,
  unit: zProductInputUnit,
  unitPrice: z.number(),
  chartOfAccountId: z.string(),
});
