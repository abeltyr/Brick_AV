import { LanguageTranslator } from '@/modules/language/components'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/modules/ui/button'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/modules/ui/collapsible"
import { useAddPurchases } from '@/lib/context/purchase/addPurchase'
import { useEffect, useState } from 'react'
import { useWatch } from 'react-hook-form'
import { Separator } from '@/modules/ui/separator'




export default function WithholdingBreakdownSection() {
    const {
        importedGoodSummaryAmount,
        importedGoodWithholding,
        localGoodSummaryAmount,
        localGoodWithholding,
        serviceSummaryAmount,
        serviceWithholding,
        withholding,
        vendor,
    } = useAddPurchases()

    const [opened, setOpened] = useState(false)


    useEffect(() => {
        console.log("withholding, withholding")
        if (withholding.greaterThan(0) && !opened) {
            setOpened(true)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [withholding])

    if (vendor && vendor.business)
        return (<div>
            <Separator className='my-8' />
            <Collapsible open={opened}>
                <div>
                    <div className='w-full flex justify-between'>
                        <div className='text-2xl font-bold'>
                            <LanguageTranslator>
                                Withholding Breakdown
                            </LanguageTranslator>
                        </div>
                        <CollapsibleTrigger>
                            <Button
                                variant={"ghost"} size={"sm"} onClick={() => { setOpened(!opened) }}
                            >
                                <ChevronDown
                                    className={`${opened && withholding.greaterThan(0) ? "rotate-180" : "rotate-0"} duration-300 transition-all`} />
                            </Button>
                        </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent>
                        {withholding.greaterThan(0) && <div className="grid gap-6 mt-6">
                            <ul className="grid gap-3">
                                <li className="flex items-center justify-between" >
                                    <span className="text-[#828282] text-sm">
                                        Local Good Summary
                                    </span>
                                    <span className="text-primary text-sm">
                                        ETB {localGoodSummaryAmount.toNumber().toLocaleString('en-US')}
                                    </span>
                                </li>
                                <li className="flex items-center justify-between" >
                                    <span className="text-[#828282] text-sm">
                                        Imported Good Summary
                                    </span>
                                    <span className="text-primary text-sm">
                                        ETB {importedGoodSummaryAmount.toNumber().toLocaleString('en-US')}
                                    </span>
                                </li>

                                <li className="flex items-center justify-between" >
                                    <span className="text-[#828282] text-sm">
                                        Service Summary
                                    </span>
                                    <span className="text-primary text-sm">
                                        ETB {serviceSummaryAmount.toNumber().toLocaleString('en-US')}
                                    </span>
                                </li>
                            </ul>
                            <ul className="grid gap-3">
                                <li className="flex items-center justify-between" >
                                    <span className="text-[#828282] text-sm">
                                        Local Good 2% withholding
                                    </span>
                                    <span className="text-primary text-sm">
                                        ETB {localGoodWithholding.toNumber().toLocaleString('en-US')}
                                    </span>
                                </li>
                                <li className="flex items-center justify-between" >
                                    <span className="text-[#828282] text-sm">
                                        Imported Good 3% withholding
                                    </span>
                                    <span className="text-primary text-sm">
                                        ETB {importedGoodWithholding.toNumber().toLocaleString('en-US')}
                                    </span>
                                </li>

                                <li className="flex items-center justify-between" >
                                    <span className="text-[#828282] text-sm">
                                        Service 2% withholding
                                    </span>
                                    <span className="text-primary text-sm">
                                        ETB {serviceWithholding.toNumber().toLocaleString('en-US')}
                                    </span>
                                </li>
                            </ul>
                            <ul className="grid gap-3">
                                <li className="flex items-center justify-between">
                                    <span className="text-[#828282] text-sm">
                                        Total Withholding
                                    </span>
                                    <span className="text-primary text-sm font-bold">
                                        ETB {withholding.toNumber().toLocaleString('en-US')}
                                    </span>
                                </li>

                            </ul>
                        </div>}
                    </CollapsibleContent>
                </div>
            </Collapsible>
        </div>

        )
}
