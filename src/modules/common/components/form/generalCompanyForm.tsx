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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/modules/ui/select'


export const GeneralCompanyForm = ({ form, title = "Manager Name", readOnlyValues = [] }: { form: UseFormReturn<z.infer<typeof companySchema>>, title?: string, readOnlyValues?: string[] }) => {

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
                                    <Input
                                        type="text"
                                        placeholder="Enter companies’ manager name"
                                        {...field}
                                        disabled={readOnlyValues.includes("managerName")}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>
            <div className='w-full flex gap-6'>
                <div className='min-w-[200px] flex-1'>
                    <FormField
                        control={form.control}
                        name="companyPhone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='text-sm'>Company Phone</FormLabel>
                                <FormControl>
                                    <div className='flex '>
                                        <Select>
                                            <SelectTrigger className="w-[100px]">
                                                <SelectValue placeholder="🇪🇹 +251" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="eth">🇪🇹 +251</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Input
                                            {...field}
                                            disabled={readOnlyValues.includes("companyPhone")}
                                            placeholder="922998885"
                                            className="flex-1 ml-1"
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className='min-w-[200px] flex-1'>
                    <FormField
                        control={form.control}
                        name="companyPhoneAlternative"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='text-sm'>Company Phone (Alternative)</FormLabel>
                                <FormControl>
                                    <div className='flex '>
                                        <Select>
                                            <SelectTrigger className="w-[100px]">
                                                <SelectValue placeholder="🇪🇹 +251" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="eth">🇪🇹 +251</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Input
                                            {...field}
                                            disabled={readOnlyValues.includes("companyPhone")}
                                            placeholder="922998885"
                                            className="flex-1 ml-1"
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                </div>
            </div>




        </div>
    )
}
