import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { NormalInput } from '../input/normal'
import { chartOfAccountSchema } from '@/lib/form/account/chartOfAccount'
import { SelectInput } from '../input/select'
import { AccountTypeData, BalanceTypeData } from '@/lib/utils/chartOfAccount/values'
import { RadioInput } from '../input/radio'
import { PriceInput } from '../input/price'
import { Card } from '@/modules/ui/card'


export const GeneralChartAccountForm = ({ form, readOnlyValues = [] }: { form: UseFormReturn<z.infer<typeof chartOfAccountSchema>>, readOnlyValues?: string[] }) => {
    return (

        <div className='flex flex-col gap-5'>
            <div className="flex-1">
                <NormalInput
                    form={form}
                    name='code'
                    title='Account Id'
                    type='number'
                    disabled={readOnlyValues.includes("code")}
                    placeholder="Enter Account Id, must be at least 4 digits"
                />
            </div>
            <div className="flex-1">
                <NormalInput
                    form={form}
                    name='name'
                    title='Account name'
                    type='text'
                    disabled={readOnlyValues.includes("name")}
                    placeholder="Enter Account name"
                />
            </div>
            <div className="flex-1">
                <SelectInput
                    form={form}
                    name='accountType'
                    title='Account type'
                    selectTitle={{
                        name: "Account type",
                        value: "Account_type"
                    }}
                    values={[...AccountTypeData]}
                />
            </div>
            <div className='flex flex-col gap-3'>
                <div className='flex justify-between'>
                    Account Initial Balance
                </div>
                <Card className='mb-4 mt-0 px-4 py-3 flex flex-col gap-4'>
                    <RadioInput
                        form={form}
                        name='balance.balanceType'
                        title="Please select which side is the balance when negative "
                        values={[...BalanceTypeData]}
                        alignment='horizontal'
                    />
                    <PriceInput
                        form={form}
                        name='balance.amount'
                        title='Initial Balance amount'
                        disabled={readOnlyValues.includes("balance.balanceType")}
                        placeholder="Enter Balance Amount"
                    />
                </Card>
            </div>

        </div>
    )
}
