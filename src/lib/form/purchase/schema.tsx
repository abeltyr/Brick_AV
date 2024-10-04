import { zProductInputType, zProductInputUnit, zProductInputWithholdingType, zPurchaseInputType } from '@/lib/form/product/data';
import { z } from 'zod';


export const ChartOfAccountValueInput = z.object({
    id: z.string(),
    balanceType: z.enum(["credit", "debit"]),
    name: z.string(),
    accountType: z.string(),
    code: z.number(),
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
    unitPrice: z.number({
        invalid_type_error: "A valid unitPrice is required"
    }),
    productCode: z.string(),
    quantity: z.number({
        invalid_type_error: "A valid quantity is required"
    }),
    name: z.string(),
})

export const purchaseSchema = z.object({
    vendorId: z.string(),
    paymentChartOfAccountId: z.string(),
    vatChartOfAccountId: z.string().optional(),
    withholdingChartOfAccountId: z.string().optional(),
    date: z.date({ required_error: "Date is required" }),
    receiptNumber: z.number(),
    mrcNumber: z.string().optional(),
    withholdingType: zProductInputWithholdingType,
    withholdingNumber: z.string().optional(),
    gebiwoch: z.object({
        purchaseType: zPurchaseInputType,
        productCategoryType: zProductInputType,
        unit: zProductInputUnit,
        description: z.string(),
    }),
    purchaseProducts: z.array(purchaseProducts).min(1, "At least one product is required"),
})