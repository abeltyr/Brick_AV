import { zProductInputTaxType, zProductInputType, zProductInputUnit, zProductInputWithholdingType, zPurchaseInputType } from '@/lib/form/product/data';
import { z } from 'zod';

export const purchaseProducts = z.object({
    initialProductPriceUnit: zProductInputUnit,
    initialProductPriceUnitPrice: z.number(),
    inventoryId: z.string(),
    productId: z.string(),
    type: zProductInputType,
    purchaseType: zPurchaseInputType,
    chartOfAccountId: z.string(),
    unit: zProductInputUnit,
    unitPrice: z.number(),
    productCode: z.string(),
    quantity: z.number(),
})

export const purchaseFormSchema = z.object({
    vendorId: z.string(),
    date: z.date(),
    taxType: zProductInputTaxType,
    receiptNumber: z.string(),
    mrcNumber: z.string().optional(),
    withholdingType: zProductInputWithholdingType,
    withholdingNumber: z.string().optional(),
    cashReceiptVoucher: z.string().optional(),
    gebiwoch: z.object({
        purchaseType: zPurchaseInputType,
        productCategoryType: zProductInputType,
        unit: zProductInputUnit,
        description: z.string(),
        quantity: z.number(),
    }),
    purchaseProducts: z.array(purchaseProducts).min(1, "At least one product is required"),
})