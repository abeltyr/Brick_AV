
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




export default function ChartOfAccountListSection() {


    const { chartOfAccount, taxTotal, withholding } = useAddPurchases()



    return (
        <Collapsible>
            <div>
                <div className='w-full flex justify-between'>
                    <div className='text-2xl font-bold'>
                        <LanguageTranslator>
                            Chart of account
                        </LanguageTranslator>
                    </div>
                    <CollapsibleTrigger>
                        <Button variant={"ghost"} size={"sm"}>
                            <ChevronDown />
                        </Button>
                    </CollapsibleTrigger>
                </div>
                <CollapsibleContent>
                    <div className="flex flex-col gap-0 mt-3">
                        <div className="text-sm font-medium">Payment account</div>
                        <ul className="grid gap-2 mt-3">
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
                                        chartOfAccount.paymentAccount.chartOfAccountBalance &&
                                        chartOfAccount.paymentAccount.chartOfAccountBalance ?
                                        new Decimal(chartOfAccount.paymentAccount.chartOfAccountBalance.balance).toNumber().toLocaleString('en-US') : 0}
                                </span>
                            </li>
                        </ul>

                        <div className={`
                            flex flex-col gap-3 
                            ${chartOfAccount && Object.values(chartOfAccount.productsChartAccount).length > 0 || taxTotal.greaterThan(0) || withholding.greaterThan(0) ? "mt-6" : "mt-0"} bg-red-400`}>

                            {chartOfAccount && Object.values(chartOfAccount.productsChartAccount).length > 0 && <ul className="flex flex-col gap-3 ">
                                {Object.values(chartOfAccount.productsChartAccount).map((data, index) => {
                                    return <li className="flex items-center justify-between" key={index}>
                                        <span className="text-[#828282] text-sm">
                                            {data.name} - {data.code} x
                                            <span>
                                                {data.quantity}
                                            </span>
                                        </span>
                                        {data.quantity && data.amount &&
                                            <span className="text-primary text-sm">
                                                ETB {`${data.amount}`}
                                            </span>
                                        }
                                    </li>
                                })}
                                {taxTotal.greaterThan(0) && <li className="flex items-center justify-between">
                                    <span className="text-[#828282] text-sm">
                                        Vat Receivable
                                    </span>
                                    <span className="text-primary text-sm">
                                        {taxTotal && taxTotal.toNumber().toLocaleString('en-US')}
                                    </span>
                                </li>}
                                {withholding.greaterThan(0) && <li className="flex items-center justify-between">
                                    <span className="text-[#828282] text-sm">
                                        Withholding Payable
                                    </span>
                                    <span className="text-primary text-sm">
                                        {withholding && withholding.toNumber().toLocaleString('en-US')}
                                    </span>
                                </li>}
                            </ul>
                            }
                            {taxTotal.greaterThan(0) && <ul className="flex flex-col gap-3 ">
                                <li className="flex items-center justify-between">
                                    <span className="text-[#828282] text-sm">
                                        Vat Receivable
                                    </span>
                                    <span className="text-primary text-sm">
                                        {taxTotal && taxTotal.toNumber().toLocaleString('en-US')}
                                    </span>
                                </li>
                            </ul>}
                            {withholding.greaterThan(0) && <ul className="flex flex-col gap-3 ">
                                <li className="flex items-center justify-between">
                                    <span className="text-[#828282] text-sm">
                                        Withholding Payable
                                    </span>
                                    <span className="text-primary text-sm">
                                        {withholding && withholding.toNumber().toLocaleString('en-US')}
                                    </span>
                                </li>
                            </ul>}
                        </div>
                    </div>
                </CollapsibleContent>
            </div>
        </Collapsible>
    )
}
