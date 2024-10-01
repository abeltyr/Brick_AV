"use client"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/modules/ui/card"
import { Separator } from "@/modules/ui/separator"
import Decimal from 'decimal.js'
import { z } from 'zod'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/modules/ui/collapsible"
import { purchaseProducts } from '@/lib/form/purchase'



const productArraySchema = z.array(purchaseProducts);

// Infer the TypeScript type from the schema
type ProductType = z.infer<typeof purchaseProducts>;
type ProductArrayType = z.infer<typeof productArraySchema>;

export default function TotalPurchaseData({
    purchaseProducts,
    grossAmount,
    nonTaxableAmount,
    taxableAmount,
    taxTotal,
    importedGoodSummaryAmount,
    importedGoodWithholding,
    localGoodSummaryAmount,
    localGoodWithholding,
    serviceSummaryAmount,
    serviceWithholding,
    withholding
}: {
    purchaseProducts: ProductArrayType,
    taxableAmount: number,
    nonTaxableAmount: number,
    taxTotal: number,
    grossAmount: number,
    importedGoodSummaryAmount: number,
    importedGoodWithholding: number,
    localGoodSummaryAmount: number,
    localGoodWithholding: number,
    serviceSummaryAmount: number,
    serviceWithholding: number,
    withholding: number,

}) {
    return (
        <div className='grid gap-4 overscroll-y-auto h-full'>
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
                            {new Decimal(nonTaxableAmount).greaterThan(0) && <li className="flex items-center justify-between">
                                <span className="text-muted-foreground">Non Taxable Amount</span>
                                <span>ETB {`${nonTaxableAmount}`}</span>
                            </li>}
                            <li className="flex items-center justify-between">
                                <span className="text-muted-foreground">15% Vat</span>
                                <span>ETB {`${taxTotal}`}</span>
                            </li>
                            {withholding && new Decimal(withholding).greaterThan(0) && <li className="flex items-center justify-between">
                                <span className="text-muted-foreground">WithHolding</span>
                                <span>ETB -{`${withholding}`}</span>
                            </li>}
                            <li className="flex items-center justify-between font-semibold">
                                <span className="text-muted-foreground">Total</span>
                                <span>ETB {`${grossAmount}`}</span>
                            </li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
            <Card className="overflow-hidden">
                <Collapsible>
                    <CollapsibleTrigger className='w-full'>
                        <CardHeader className="flex flex-row items-start bg-muted/50 w-full">
                            <CardTitle className="group flex items-center gap-2 text-lg w-full">
                                WithHolding Breakdown
                            </CardTitle>
                        </CardHeader></CollapsibleTrigger>
                    <CollapsibleContent>

                        <CardContent className="p-6 text-sm">
                            <div className="grid gap-3">
                                <ul className="grid gap-3">
                                    <li className="flex items-center justify-between" >
                                        <span className="text-muted-foreground">
                                            Local Good Summary
                                        </span>
                                        <span>ETB {`${localGoodSummaryAmount}`}</span>
                                    </li>
                                    <li className="flex items-center justify-between" >
                                        <span className="text-muted-foreground">
                                            Imported Good Summary
                                        </span>
                                        <span>ETB {`${importedGoodSummaryAmount}`}</span>
                                    </li>

                                    <li className="flex items-center justify-between" >
                                        <span className="text-muted-foreground">
                                            Service Summary
                                        </span>
                                        <span>ETB {`${serviceSummaryAmount}`}</span>
                                    </li>
                                </ul>
                                <Separator className="my-2" />
                                <ul className="grid gap-3">
                                    <li className="flex items-center justify-between" >
                                        <span className="text-muted-foreground">
                                            Local Good 2% withholding
                                        </span>
                                        <span>ETB {`${localGoodWithholding}`}</span>
                                    </li>
                                    <li className="flex items-center justify-between" >
                                        <span className="text-muted-foreground">
                                            Imported Good 3% withholding
                                        </span>
                                        <span>ETB {`${importedGoodWithholding}`}</span>
                                    </li>

                                    <li className="flex items-center justify-between" >
                                        <span className="text-muted-foreground">
                                            Service 2% withholding
                                        </span>
                                        <span>ETB {`${serviceWithholding}`}</span>
                                    </li>

                                </ul>
                                <Separator className="my-2" />
                                <ul className="grid gap-3">
                                    <li className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Total Amount</span>
                                        <span>ETB {`${withholding}`}</span>
                                    </li>

                                </ul>
                            </div>
                        </CardContent>
                    </CollapsibleContent>
                </Collapsible>
            </Card>
        </div>
    )
}
