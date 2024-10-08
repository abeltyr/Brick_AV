import React from 'react'
import { companySchema } from '@/lib/form/account'
import { UseFormReturn, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/modules/ui/button'
import { NormalInput } from '../input/normal'
import { PhoneNumberInput } from '../input/phoneNumber'


export const GeneralCompanyForm = ({ form, title = "Manager Name", readOnlyValues = [] }: { form: UseFormReturn<z.infer<typeof companySchema>>, title?: string, readOnlyValues?: string[] }) => {

    const watchedTaxType = useWatch({
        control: form.control,
        name: "taxType",
    });

    return (
        <div className='flex flex-col gap-5'>
            <div className='w-full flex gap-5'>
                <Button
                    onClick={(e) => {
                        e.preventDefault();
                        form.setValue("taxType", "VAT")
                    }}
                    variant={watchedTaxType === "VAT" ? "default" : "secondary"}
                    className='flex-1'>
                    VAT
                </Button>
                <Button
                    onClick={(e) => {
                        e.preventDefault();
                        form.setValue("taxType", "TOT")
                    }}
                    variant={watchedTaxType === "TOT" ? "default" : "secondary"}
                    className='flex-1'>
                    TOT
                </Button>
            </div>

            <div className=" gap-3 flex justify-between">
                <div className="flex-1">
                    <NormalInput
                        form={form}
                        name='managerName'
                        title="Manager Name"
                        type='text'
                        placeholder="Enter companies’ manager name"
                    />
                </div>
            </div>
            <div className='w-full flex gap-6'>

                <div className='min-w-[200px] flex-1'>
                    <NormalInput
                        form={form}
                        name='email'
                        title="Company Email"
                        type='text'
                        placeholder="Company Email Address"
                    />
                </div>
                <div className='min-w-[200px] flex-1'>
                    <PhoneNumberInput
                        form={form}
                        name='companyPhone'
                        title="Company Phone"
                        placeholder="922998885"
                    />
                </div>
            </div>




        </div>
    )
}
