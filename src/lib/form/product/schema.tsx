import { zProductInputType, zProductInputUnit, zPurchaseInputType } from '@/types/product';
import { z } from 'zod';

export const productFormSchema = z.object({
    purchaseType: zPurchaseInputType,
    type: zProductInputType,
    unit: zProductInputUnit,
    productCode: z.string(),
    unitPrice: z.number(),
    name: z.string().min(1, {
        message: "A valid name with at least three words is needed",
    }),
    description: z.string().optional(),
})
