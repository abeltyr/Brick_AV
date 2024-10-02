import { zProductInputType, zProductInputUnit, zProductInputWithholdingType, zPurchaseInputType } from '@/lib/form/product/data';
import { z } from 'zod';


export const ChartOfAccountValueInput = z.object({
    id: z.string(),
    balanceType: z.enum(["credit", "debit"]),
    name: z.string(),
    code: z.string(),
    balance: z.number(),
});

export const purchaseProducts = z.object({
    initialProductPriceUnit: zProductInputUnit,
    initialProductPriceUnitPrice: z.number(),
    inventoryId: z.string(),
    productId: z.string(),
    type: zProductInputType,
    chartOfAccount: ChartOfAccountValueInput,
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
    receiptNumber: z.string(),
    mrcNumber: z.string().optional(),
    withholdingType: zProductInputWithholdingType,
    withholdingNumber: z.string().optional(),
    cashReceiptVoucher: z.string().optional(),
    chartOfAccount: z.object({
        paymentChartOfAccount: ChartOfAccountValueInput.optional(),
        vatChartOfAccountId: ChartOfAccountValueInput.optional(),
        withholdingChartOfAccountId: ChartOfAccountValueInput.optional(),
    }),
    gebiwoch: z.object({
        purchaseType: zPurchaseInputType,
        productCategoryType: zProductInputType,
        unit: zProductInputUnit,
        description: z.string(),
        quantity: z.number(),
    }),
    purchaseProducts: z.array(purchaseProducts).min(1, "At least one product is required"),
})