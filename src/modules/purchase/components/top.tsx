import { DatePickerInput } from '@/modules/common/components/input/date';
import { ChartOfAccountType } from '@/types/purchase';
import React from 'react'
import { purchaseSchema } from '@/lib/form/purchase'
import { z } from 'zod';
import { UseFormReturn } from 'react-hook-form';
import { ChartOfAccountInput } from '@/modules/common/components/input/coa';

export const AddPurchaseTopSection = ({ form, companyId }: {
    companyId: string, form: UseFormReturn<z.infer<typeof purchaseSchema>>
}) => {
    return (
        <div className='w-full flex justify-between item-center gap-6 my-10'>
            <div className='flex flex-col gap-1'>
                <p className='text-3xl font-black text-black'>
                    Add Purchase
                </p>
                <p className='text-base font-normal text-[#757575]'>
                    Overview of charges, payments and detailed insights.
                </p>
            </div>
            <div className='flex gap-3'>
                <div>
                    <DatePickerInput
                        form={form}
                        name='date'
                    />
                </div>
                <ChartOfAccountInput
                    companyId={companyId}
                    className=''
                    setChartOfAccount={(coa: ChartOfAccountType) => {
                        form.setValue("chartOfAccount.paymentChartOfAccount.id", coa.id);
                        form.clearErrors()
                    }}
                    formData={form}
                    title='Payment COA'
                />
            </div>
        </div>
    )
}

export default top

