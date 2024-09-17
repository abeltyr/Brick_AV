import React from 'react'
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/modules/ui/form"
import { companySchema } from '@/lib/form/account'
import { Input } from "@/modules/ui/input"
import { UseFormReturn, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { LanguageTranslator } from '@/modules/language/components'


export const GeneralCompanyForm = ({ form, title = "Manager Name" }: { form: UseFormReturn<z.infer<typeof companySchema>>, title?: string }) => {

    return (
        <div className='flex flex-col gap-5'>
            <div className=" gap-3 flex justify-between">
                <div className="flex-1">
                    <FormField
                        control={form.control}
                        name="managerName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='text-sm'>
                                    <LanguageTranslator>
                                        {title}
                                    </LanguageTranslator></FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="Enter companies’ manager name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>

            <FormField
                control={form.control}
                name="companyPhone"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className='text-sm'>Company Phone</FormLabel>
                        <FormControl>
                            <Input
                                placeholder="Enter companies’ phone"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="companyPhoneAlternative"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className='text-sm'>Company Phone (Alternative)</FormLabel>
                        <FormControl>
                            <Input
                                placeholder="Enter companies’ alternative phone"
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
