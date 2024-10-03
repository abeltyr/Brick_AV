
import { LanguageTranslator } from '@/modules/language/components'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/modules/ui/card"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/modules/ui/form'
import { Input } from "@/modules/ui/input"
import { Textarea } from '@/modules/ui/textarea'
import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/modules/ui/button"
import { Calendar } from "@/modules/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/modules/ui/popover"
import { purchaseSchema } from '@/lib/form/purchase'
import { UseFormReturn, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { ChartOfAccountDataType, ReceiptType, useAddPurchases } from '@/lib/context/purchase/addPurchase'
import { ZeroAdjustableInput } from '@/modules/common/components/input/tin'
import { RadioInput } from '@/modules/common/components/input/radio'
import { RadioGroup, RadioGroupItem } from '@/modules/ui/radio-group'
import { Label } from '@radix-ui/react-label'
import { PriceInput } from '@/modules/common/components/input/price'
import { NormalInput } from '@/modules/common/components/input/normal'
import { ChartOfAccountInput } from '@/modules/common/components/input/coa'
import { useCompany } from '@/lib/context/account'
import { ChartOfAccountType } from '@/types/purchase'
import Decimal from 'decimal.js'


export default function PurchaseDetailForm() {
    const { form, vendor, receiptType, setReceiptType, taxTotal, setChartOfAccount, chartOfAccount, withholding, watchedWithholdingType } = useAddPurchases();
    const { currentCompany } = useCompany();




    return (
        <div className={`w-full px-6 flex flex-col gap-6`}>
            <div>
                <p className='text-2xl font-bold'>
                    <LanguageTranslator>
                        Purchase Detail
                    </LanguageTranslator>
                </p>
                <p className='text-sm font-light text-[#71717A]'>
                    <LanguageTranslator>
                        Provided the needed Purchase Detail
                    </LanguageTranslator>
                </p>
            </div>
            <div className="grid gap-6">
                {vendor && vendor.business && <div>
                    <FormLabel className='text-sm font-medium'>
                        <LanguageTranslator>
                            With what was the receipt print
                        </LanguageTranslator>
                    </FormLabel>
                    <FormControl className='pt-2'>
                        <RadioGroup
                            className={`flex  gap-6`}
                            onValueChange={(data: ReceiptType) => {
                                setReceiptType(data)
                            }}
                            defaultValue={"Machine"}
                            value={receiptType}
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                    value={"Machine"}
                                    id={"Machine"}
                                    onClick={() => {
                                        // if (data.onClick) data.onClick()
                                    }}
                                />
                                <Label htmlFor={"Machine"} className='text-sm font-medium'>{"Machine"}</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                    value={"Manual"}
                                    id={"Manual"}
                                    onClick={() => {
                                        // if (data.onClick) data.onClick()
                                    }}
                                />
                                <Label htmlFor={"Manual"} className='text-sm font-medium'>{"Manual"}</Label>
                            </div>
                        </RadioGroup>
                    </FormControl>
                </div>}

                {vendor && vendor.business && <div className="gap-3 flex">
                    <div className='flex-1 flex flex-col space-y-2'>
                        <FormLabel className='text-sm'>
                            Invoice Number
                        </FormLabel>
                        <div className='flex gap-1'>
                            <Button disabled variant={"secondary"}>
                                {receiptType === "Machine" ? "FS" : "CSI"}
                            </Button>
                            <div className='flex-1'>
                                {receiptType === "Machine" ? <ZeroAdjustableInput
                                    form={form}
                                    name='receiptNumber'
                                    placeholder="0001"
                                    lengthData={8}
                                /> : <PriceInput
                                    form={form}
                                    name={`receiptNumber`}
                                    placeholder="1"
                                />}
                            </div>
                        </div>
                    </div>
                    {vendor.business && receiptType === "Machine" && <div className='flex-1'>
                        <NormalInput
                            form={form}
                            name='mrcNumber'
                            title="Mrc Number"
                            type='text'
                            placeholder="Mrc Number"
                        />
                    </div>
                    }

                    {currentCompany && <div className='flex-1 flex flex-col space-y-2'>
                        <FormLabel className='text-sm'>
                            Vat Chart of account
                        </FormLabel>
                        <div className='flex gap-1 flex-1'>
                            <ChartOfAccountInput
                                companyId={currentCompany.companyId}
                                className=''
                                setChartOfAccount={(coa: ChartOfAccountType) => {
                                    const data: ChartOfAccountDataType = {
                                        id: coa.id,
                                        amount: taxTotal.toNumber(),
                                        balanceType: coa.creditBased ? "credit" : "debit",
                                        name: coa.name,
                                        code: coa.code,
                                        accountType: coa.accountType,
                                    }
                                    // form!.setValue("chartOfAccount.vatChartOfAccount", { ...data });
                                    // form!.clearErrors()
                                    setChartOfAccount((prevState) => ({
                                        ...prevState, // Keep other properties unchanged
                                        vatAccount: data, // Update productsChartAccount
                                    }));
                                }}
                                formData={form}
                                showIcon={true}
                                title='Chart Of Account'
                                variant={"outline"}
                                defaultCOAId={chartOfAccount.vatAccount?.id}
                            />
                        </div>
                    </div>

                    }
                </div>}
            </div>

            <div className="grid gap-8">

                {vendor && !vendor.business && <div className='w-full flex gap-4'>
                    <Button
                        onClick={() => {
                            form!.setValue("withholdingType", "hasWithholding")
                        }}
                        variant={watchedWithholdingType === "hasWithholding" ? "default" : "secondary"}
                        className='flex-1'>
                        Withholding 30%
                    </Button>
                    <Button
                        onClick={() => {
                            form!.setValue("withholdingType", "noWithholding")
                        }}
                        variant={watchedWithholdingType === "noWithholding" ? "default" : "secondary"}
                        className='flex-1'>
                        No Withholding
                    </Button>
                </div>}

                {vendor && <div className="gap-3 flex">
                    {(!vendor.business && watchedWithholdingType === "hasWithholding") || (vendor.business && withholding.greaterThan(0)) ?
                        <div className='flex-1'>
                            <NormalInput
                                form={form}
                                name='withholdingNumber'
                                title="Withholding Number"
                                type='text'
                                placeholder="Withholding Number"
                            />
                        </div>
                        : <></>}

                    {watchedWithholdingType === "noWithholding" && !vendor.business &&
                        <div className='flex-1'>
                            <NormalInput
                                form={form}
                                name='cashReceiptVoucher'
                                title="Cash Receipt Voucher"
                                type='text'
                                placeholder="Cash Receipt Voucher"
                            />
                        </div>
                    }

                    {currentCompany && (!vendor.business && watchedWithholdingType === "hasWithholding" || (vendor.business && withholding.greaterThan(0))) && <div className='flex-1 flex flex-col space-y-2'>
                        <FormLabel className='text-sm'>
                            Withholding Chart of account
                        </FormLabel>
                        <div className='flex gap-1 flex-1'>
                            <ChartOfAccountInput
                                companyId={currentCompany.companyId}
                                className=''
                                setChartOfAccount={(coa: ChartOfAccountType) => {
                                    const data: ChartOfAccountDataType = {
                                        id: coa.id,
                                        amount: taxTotal.toNumber(),
                                        balanceType: coa.creditBased ? "credit" : "debit",
                                        name: coa.name,
                                        code: coa.code,
                                        accountType: coa.accountType,
                                    }
                                    // form!.setValue("chartOfAccount.withholdingChartOfAccount", { ...data });
                                    // form!.clearErrors()
                                    setChartOfAccount((prevState) => ({
                                        ...prevState, // Keep other properties unchanged
                                        withHolding: data, // Update productsChartAccount
                                    }));
                                }}
                                formData={form}
                                showIcon={true}
                                title='Chart Of Account'
                                variant={"outline"}
                                defaultCOAId={chartOfAccount.withHolding?.id}
                            />
                        </div>
                    </div>

                    }
                </div>}
            </div>

        </div>
    )
}
