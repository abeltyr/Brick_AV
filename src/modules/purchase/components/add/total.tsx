"use client"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/modules/ui/card"
import { Separator } from "@/modules/ui/separator"
import { zProductInputType, zProductInputUnit, zPurchaseInputType } from '@/types/product'
import Decimal from 'decimal.js'
import { z } from 'zod'

const productSchema = z.object({
    productId: z.string(),
    name: z.string(),
    purchaseType: zPurchaseInputType,
    type: zProductInputType,
    unit: zProductInputUnit,
    unitPrice: z.instanceof(Decimal),
    quantity: z.number(),
    totalValue: z.instanceof(Decimal),
});

const productArraySchema = z.array(productSchema);

// Infer the TypeScript type from the schema
type ProductType = z.infer<typeof productSchema>;
type ProductArrayType = z.infer<typeof productArraySchema>;

export default function TotalPurchaseData({
    purchaseProducts,
    grossAmount,
    nonTaxableAmount,
    taxableAmount,
    totalVat
}: {
    purchaseProducts: ProductArrayType,
    taxableAmount: Decimal,
    nonTaxableAmount: Decimal,
    totalVat: Decimal,
    grossAmount: Decimal,

}) {
    return (
        <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-start bg-muted/50">
                <CardTitle className="group flex items-center gap-2 text-lg">
                    Purchase Summation
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-sm">
                <div className="grid gap-3">
                    <div className="font-semibold">Products Details</div>
                    <ul className="grid gap-3">

                        {purchaseProducts && purchaseProducts.map((data, index) => {
                            return <li className="flex items-center justify-between" key={index}>
                                <span className="text-muted-foreground">
                                    {data.name} x <span>{data.quantity}</span>
                                </span>
                                {data.quantity && data.unitPrice && <span>ETB {`${(new Decimal(data.quantity)).mul(data.unitPrice)}`}</span>}
                            </li>
                        })}
                    </ul>
                    <Separator className="my-2" />
                    <ul className="grid gap-3">
                        <li className="flex items-center justify-between">
                            <span className="text-muted-foreground">Taxable Amount</span>
                            <span>ETB {`${taxableAmount}`}</span>
                        </li>
                        {nonTaxableAmount.greaterThan(0) && <li className="flex items-center justify-between">
                            <span className="text-muted-foreground">Non Taxable Amount</span>
                            <span>ETB {`${nonTaxableAmount}`}</span>
                        </li>}
                        <li className="flex items-center justify-between">
                            <span className="text-muted-foreground">15% Vat</span>
                            <span>ETB {`${totalVat}`}</span>
                        </li>
                        <li className="flex items-center justify-between font-semibold">
                            <span className="text-muted-foreground">Total</span>
                            <span>ETB {`${grossAmount}`}</span>
                        </li>
                    </ul>
                </div>
            </CardContent>

        </Card>
    )
}
