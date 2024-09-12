import { zProductInputType, zProductInputUnit, zPurchaseInputType } from '@/lib/form/product/data';
import { z } from 'zod';

export const productFormSchema = z.object({
    purchaseType: zPurchaseInputType,
    type: zProductInputType,
    unit: zProductInputUnit,
    unitPrice: z.number(),
    name: z.string().min(2, {
        message: "A valid name with at least two words is needed",
    }),
    description: z.string().optional(),
})
