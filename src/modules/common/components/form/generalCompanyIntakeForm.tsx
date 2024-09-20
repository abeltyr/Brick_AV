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
import { UseFormReturn, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { LanguageTranslator } from '@/modules/language/components'
import { Label } from '@/modules/ui/label'
import { RadioGroup, RadioGroupItem } from '@/modules/ui/radio-group'


export const GeneralCompanyIntakeForm = ({ form, title = "Company Name", readOnlyValues = [] }: { form: UseFormReturn<z.infer<typeof companyInTakeSchema>>, title?: string, readOnlyValues?: string[] }) => {

    const watchedRegisteredData = useWatch({
        control: form.control,
        name: "isRegistered",
    });

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
            <div className="space-y-2">
                <FormField
                    control={form.control}
                    name="isRegistered"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-sm'>
                                <LanguageTranslator>
                                    Is it a registered business?
                                </LanguageTranslator></FormLabel>
                            <FormControl>
                                <RadioGroup
                                    className='flex gap-6'
                                    {...field}
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    value={field.value}
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem
                                            value="yes"
                                            id="yes"
                                        />
                                        <Label htmlFor="yes">Yes</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem
                                            value="no"
                                            id="no"
                                        />
                                        <Label htmlFor="no">No</Label>
                                    </div>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            {watchedRegisteredData === 'yes' && <FormField
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
            />}

        </div>
    )
}
