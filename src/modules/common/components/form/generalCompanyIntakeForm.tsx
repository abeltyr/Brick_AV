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


export const GeneralCompanyIntakeForm = ({ form, title = "Company Name", readOnlyValues = [] }: { form: UseFormReturn<z.infer<typeof companyInTakeSchema>>, title?: string, readOnlyValues?: string[] }) => {


    return (
        <div className='flex flex-col gap-5'>
            <div className=" gap-3 flex justify-between">
                <div className="flex-1">
                    <FormField
                        control={form.control}
                        name="companyName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='text-sm'>
                                    <LanguageTranslator>
                                        {title}
                                    </LanguageTranslator></FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="Eurka Tech"
                                        {...field}
                                        disabled={readOnlyValues.includes("companyName")}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>
            <FormField
                control={form.control}
                name="tinNumber"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className='text-sm'>Company Tin</FormLabel>
                        <FormControl>
                            <Input
                                placeholder="Enter your TIN number"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

        </div>
    )
}
