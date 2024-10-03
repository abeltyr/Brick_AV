
import { LanguageTranslator } from '@/modules/language/components'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/modules/ui/button'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/modules/ui/collapsible"
import { useAddPurchases } from '@/lib/context/purchase/addPurchase'
import { CardContent } from '@/modules/ui/card'
import { Separator } from '@/modules/ui/separator'
import Decimal from 'decimal.js'
import { useEffect, useState } from 'react'




export default function PurchaseSummationSection() {

    const {
        taxableAmount,
        nonTaxableAmount,
        taxTotal,
        grossAmount,
        withholding,
        purchaseProducts,
        vendor,
        form,
        totalAmount,
        goodTotTotal,
        serviceTotTotal,
    } = useAddPurchases()

    const [opened, setOpened] = useState(false)


    useEffect(() => {
        if (purchaseProducts && !opened) {
            setOpened(true)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [purchaseProducts])

    return (
        <Collapsible open={opened} >
            <div>
                <div className='w-full flex justify-between'>
                    <div className='text-2xl font-bold'>
                        <LanguageTranslator>
                            Purchase Summation
                        </LanguageTranslator>
                    </div>
                    <CollapsibleTrigger>
                        <Button variant={"ghost"} size={"sm"} onClick={() => { setOpened(!opened) }}
                        >
                            <ChevronDown
                                className={`${opened && (purchaseProducts != null && purchaseProducts.length > 0) ? "rotate-180" : "rotate-0"} duration-300 transition-all`} />
                        </Button>
                    </CollapsibleTrigger>
                </div>
                <CollapsibleContent>
                    {purchaseProducts && <div className="flex flex-col gap-6 mt-6">
                        <div className="text-sm font-medium">Products Details</div>
                        <ul className="grid gap-3">
                            {purchaseProducts && purchaseProducts.map((data, index) => {
                                return <li className="flex items-center justify-between" key={index}>
                                    <span className="text-[#828282] text-sm">
                                        {data.name} x
                                        <span>
                                            {data.quantity}
                                        </span>
                                    </span>
                                    {data.quantity && data.unitPrice &&
                                        <span className="text-primary text-sm">
                                            ETB {(new Decimal(data.quantity)).mul(data.unitPrice).toNumber().toLocaleString('en-US')}
                                        </span>
                                    }
                                </li>
                            })}
                        </ul>
                        <ul className="grid gap-3">
                            <li className="flex items-center justify-between">
                                <span className="text-[#828282] text-sm">
                                    Taxable Amount
                                </span>
                                <span className="text-primary text-sm">
                                    ETB {taxableAmount.toNumber().toLocaleString('en-US')}
                                </span>
                            </li>
                            {new Decimal(nonTaxableAmount).greaterThan(0) && <li className="flex items-center justify-between">
                                <span className="text-[#828282] text-sm">
                                    Non Taxable Amount
                                </span>
                                <span className="text-primary text-sm">
                                    ETB {nonTaxableAmount.toNumber().toLocaleString('en-US')}
                                </span>
                            </li>}
                            {vendor && vendor.business && vendor.business.tin && vendor.taxType === "VAT" && <li className="flex items-center justify-between">
                                <span className="text-[#828282] text-sm">
                                    15% Vat
                                </span>
                                <span className="text-primary text-sm">
                                    ETB {taxTotal.toNumber().toLocaleString('en-US')}
                                </span>
                            </li>}
                            {vendor && vendor.business && vendor.business.tin && vendor.taxType === "TOT" && goodTotTotal.greaterThan(0) && <li className="flex items-center justify-between">
                                <span className="text-[#828282] text-sm">
                                    2% TOT
                                </span>
                                <span className="text-primary text-sm">
                                    ETB {goodTotTotal.toNumber().toLocaleString('en-US')}
                                </span>
                            </li>}

                            {vendor && vendor.business && vendor.business.tin && vendor.taxType === "TOT" && serviceTotTotal.greaterThan(0) && <li className="flex items-center justify-between">
                                <span className="text-[#828282] text-sm">
                                    10% TOT
                                </span>
                                <span className="text-primary text-sm">
                                    ETB {serviceTotTotal.toNumber().toLocaleString('en-US')}
                                </span>
                            </li>}

                            {vendor && vendor.business && vendor.business.tin && vendor.taxType === "TOT" && goodTotTotal.greaterThan(0) && serviceTotTotal.greaterThan(0) && <li className="flex items-center justify-between">
                                <span className="text-[#828282] text-sm">
                                    Total TOT
                                </span>
                                <span className="text-primary text-sm">
                                    ETB {taxTotal.toNumber().toLocaleString('en-US')}
                                </span>
                            </li>}
                            {withholding && withholding.greaterThan(0) && <li className="flex items-center justify-between">
                                <span className="text-[#828282] text-sm">
                                    WithHolding
                                </span>
                                <span className="text-primary text-sm">
                                    ETB -{withholding.toNumber().toLocaleString('en-US')}
                                </span>
                            </li>}
                        </ul>

                        <ul className="grid gap-3">
                            <li className="flex items-center justify-between font-semibold">
                                <span className="text-[#828282] text-sm">
                                    Total
                                </span>
                                <span className="text-primary text-sm font-bold">
                                    ETB {grossAmount.toNumber().toLocaleString('en-US')}
                                </span>
                            </li>
                        </ul>
                    </div>}
                </CollapsibleContent>
            </div>
        </Collapsible>
    )
}
