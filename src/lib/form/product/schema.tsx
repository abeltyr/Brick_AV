import { zProductInputType, zProductInputUnit, zPurchaseInputType } from '@/types/product';
import { z } from 'zod';

export const productFormSchema = z.object({
    purchaseType: zPurchaseInputType,
    type: zProductInputType,
    unit: zProductInputUnit,
    unitPrice: z.union([
        z.string().transform(x => x.replace(/[^0-9.-]+/g, '')),
        z.number(),
    ]),
    name: z.string().min(3, {
        message: "A valid name with at least three words is needed",
    }),
    description: z.string().optional(),
})
