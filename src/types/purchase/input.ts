import { purchaseProducts, purchaseSchema } from "@/lib/form/purchase";
import { z } from "zod";

export type PurchaseInputType = z.infer<typeof purchaseSchema>;

export type PurchaseProductInput = z.infer<typeof purchaseProducts>;
