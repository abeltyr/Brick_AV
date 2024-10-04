import React from 'react'
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/modules/ui/form"
import { companyInTakeSchema } from '@/lib/form/account'
import { Input } from "@/modules/ui/input"
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { LanguageTranslator } from '@/modules/language/components'
import { NormalInput } from '../input/normal'
import { ZeroAdjustableInput } from '../input/tin'


export const GeneralCompanyIntakeForm = ({ form, title = "Company Name", readOnlyValues = [] }: { form: UseFormReturn<z.infer<typeof companyInTakeSchema>>, title?: string, readOnlyValues?: string[] }) => {


    return (
        <div className='flex flex-col gap-5'>
            <div className=" gap-3 flex justify-between">
                <div className="flex-1">
                    <NormalInput
                        form={form}
                        name='companyName'
                        title="Company Name"
                        type='text'
                        placeholder="Eurka Tech"
                    />
                </div>
            </div>

            <ZeroAdjustableInput title={"Company Tin"} name="tin" form={form} placeholder='Enter Tax Identification Number (TIN)' />

        </div>
    )
}
