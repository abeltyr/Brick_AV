import { zProductInputType, zProductInputUnit, zProductInputWithholdingType, zPurchaseInputType } from '@/lib/form/product/data';
import { z } from 'zod';


export const ChartOfAccountValueInput = z.object({
    id: z.string(),
    balanceType: z.enum(["credit", "debit"]),
    name: z.string(),
    accountType: z.string(),
    code: z.string(),
    amount: z.number().optional(),
    balance: z.number().optional(),
    quantity: z.number().optional(),
});

export const purchaseProducts = z.object({
    initialProductPriceUnit: zProductInputUnit,
    initialProductPriceUnitPrice: z.number(),
    inventoryId: z.string(),
    productId: z.string(),
    type: zProductInputType,
    chartOfAccount: ChartOfAccountValueInput.optional(),
    purchaseType: zPurchaseInputType,
    unit: zProductInputUnit,
    unitPrice: z.number(),
    productCode: z.string(),
    quantity: z.number(),
    name: z.string(),
})

export const purchaseSchema = z.object({
    vendorId: z.string(),
    date: z.date(),
    receiptNumber: z.string().optional(),
    mrcNumber: z.string().optional(),
    withholdingType: zProductInputWithholdingType,
    withholdingNumber: z.string().optional(),
    cashReceiptVoucher: z.string().optional(),
    gebiwoch: z.object({
        purchaseType: zPurchaseInputType,
        productCategoryType: zProductInputType,
        unit: zProductInputUnit,
        description: z.string(),
    }),
    purchaseProducts: z.array(purchaseProducts).min(1, "At least one product is required"),
})