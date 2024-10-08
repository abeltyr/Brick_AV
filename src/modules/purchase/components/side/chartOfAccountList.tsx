
import { LanguageTranslator } from '@/modules/language/components'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/modules/ui/button'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/modules/ui/collapsible"
import { useAddPurchases } from '@/lib/context/purchase/addPurchase'
import Decimal from 'decimal.js'
import { useEffect, useState } from 'react'




export default function ChartOfAccountListSection() {


    const { chartOfAccount, taxTotal, withholding, vendor } = useAddPurchases()

    const [opened, setOpened] = useState(false)

    useEffect(() => {
        console.log("chartOfAccount.paymentAccount, chartOfAccount.paymentAccount")
        if (chartOfAccount.paymentAccount && !opened) {
            setOpened(true)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chartOfAccount.paymentAccount])


    return (
        <Collapsible open={opened}>
            <div>
                <div className='w-full flex justify-between'>
                    <div className='text-2xl font-bold'>
                        <LanguageTranslator>
                            Chart of account
                        </LanguageTranslator>
                    </div>
                    <CollapsibleTrigger>
                        <Button
                            variant={"ghost"}
                            size={"sm"}
                            onClick={() => { setOpened(!opened) }}
                        >
                            <ChevronDown
                                className={`${opened && chartOfAccount.paymentAccount ? "rotate-180" : "rotate-0"} duration-300 transition-all`}
                            />

                        </Button>
                    </CollapsibleTrigger>
                </div>
                <CollapsibleContent>
                    <div className={`flex flex-col gap-0 ${chartOfAccount.paymentAccount ? "mt-3" : ""}`}>
                        {chartOfAccount.paymentAccount && <div className="text-sm font-medium">Payment account</div>}
                        {chartOfAccount.paymentAccount && <ul className="grid gap-2 mt-3">
                            <li className="flex items-center justify-between">
                                <span className="text-[#828282] text-sm">
                                    Category
                                </span>
                                <span className="text-primary text-sm">
                                    {chartOfAccount.paymentAccount && chartOfAccount.paymentAccount?.accountType}
                                </span>
                            </li>
                            <li className="flex items-center justify-between">
                                <span className="text-[#828282] text-sm">
                                    Account Name
                                </span>
                                <span className="text-primary text-sm">
                                    {chartOfAccount.paymentAccount && chartOfAccount.paymentAccount?.name}
                                </span>
                            </li>
                            <li className="flex items-center justify-between">
                                <span className="text-[#828282] text-sm">
                                    Balance
                                </span>
                                <span className="text-primary text-sm">
                                    ETB  {chartOfAccount.paymentAccount &&
                                        chartOfAccount.paymentAccount.balance ?
                                        new Decimal(chartOfAccount.paymentAccount.balance).toNumber().toLocaleString('en-US') : 0}
                                </span>
                            </li>
                        </ul>}

                        <div className={`
                            flex flex-col gap-3 
                            ${chartOfAccount && Object.values(chartOfAccount.productsChartAccount).length > 0 || taxTotal.greaterThan(0) || withholding.greaterThan(0) ? "mt-6" : "mt-0"}`}>

                            {chartOfAccount && Object.values(chartOfAccount.productsChartAccount).length > 0 && <ul className="flex flex-col gap-3 ">
                                {Object.values(chartOfAccount.productsChartAccount).map((data, index) => {
                                    return <li className="flex items-center justify-between" key={index}>
                                        <span className="text-[#828282] text-sm">
                                            {data.name} {" x "}
                                            <span>
                                                {data.quantity}
                                            </span>
                                            {" - "}<span className='text-xs px-1 py-1 bg-green-200 rounded-md'>
                                                D
                                            </span>
                                        </span>
                                        {data.quantity && data.amount &&
                                            <span className="text-primary text-sm">
                                                ETB {`${new Decimal(data.amount).toNumber().toLocaleString('en-US')}`}
                                            </span>
                                        }
                                    </li>
                                })}
                                {taxTotal.greaterThan(0) && chartOfAccount.vatAccount && vendor && vendor.taxType === "VAT" && <li className="flex items-center justify-between">
                                    <span className="text-[#828282] text-sm">
                                        {chartOfAccount.vatAccount?.name}
                                    </span>
                                    <span className="text-primary text-sm">
                                        {taxTotal && taxTotal.toNumber().toLocaleString('en-US')}
                                    </span>
                                </li>}
                                {withholding.greaterThan(0) && chartOfAccount.withHolding && <li className="flex items-center justify-between">
                                    <span className="text-[#828282] text-sm">
                                        {chartOfAccount.withHolding?.name}
                                    </span>
                                    <span className="text-primary text-sm">
                                        {withholding && withholding.toNumber().toLocaleString('en-US')}
                                    </span>
                                </li>}
                            </ul>
                            }
                            {/* {taxTotal.greaterThan(0) && <ul className="flex flex-col gap-3 ">
                                <li className="flex items-center justify-between">
                                    <span className="text-[#828282] text-sm">
                                        Vat Receivable
                                    </span>
                                    <span className="text-primary text-sm">
                                        {taxTotal && taxTotal.toNumber().toLocaleString('en-US')}
                                    </span>
                                </li>
                            </ul>}
                             */}
                            {/* {withholding.greaterThan(0) && <ul className="flex flex-col gap-3 ">
                                <li className="flex items-center justify-between">
                                    <span className="text-[#828282] text-sm">
                                        Withholding Payable
                                    </span>
                                    <span className="text-primary text-sm">
                                        {withholding && withholding.toNumber().toLocaleString('en-US')}
                                    </span>
                                </li>
                            </ul>} */}
                        </div>
                    </div>
                </CollapsibleContent>
            </div>
        </Collapsible>
    )
}
