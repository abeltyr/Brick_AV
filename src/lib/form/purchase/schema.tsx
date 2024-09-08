import { zProductInputType, zProductInputUnit, zPurchaseInputType } from '@/types/product';
import { z } from 'zod';

export const purchaseProducts = z.object({
    productId: z.string(),
    productCode: z.string(),
    name: z.string(),
    purchaseType: zPurchaseInputType,
    type: zProductInputType,
    unit: zProductInputUnit,
    unitPrice: z.number(),
    quantity: z.number(),
})

export const purchaseFormSchema = z.object({
    vendorId: z.string(),
    date: z.date(),
    invoiceNumber: z.string(),
    withholdingNumber: z.string().optional(),
    MRCNumber: z.string().optional(),
    VatReceiptNumber: z.string().optional(),
    purchaseType: zPurchaseInputType,
    type: zProductInputType,
    unit: zProductInputUnit,
    description: z.string(),
    purchaseProducts: z.array(purchaseProducts).min(1, "At least one product is required"),
})