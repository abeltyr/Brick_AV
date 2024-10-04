import React from 'react'
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/modules/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/modules/ui/select'
import { profileSchema } from '@/lib/form/account/profile'
import { Label } from '@/modules/ui/label'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { NormalInput } from '../input/normal'
import { PhoneNumberInput } from '../input/phoneNumber'
import { RadioInput } from '../input/radio'


export const GeneralProfileForm = ({ form, readOnlyValues = [], hideForm = [] }: { form: UseFormReturn<z.infer<typeof profileSchema>>, readOnlyValues?: string[], hideForm?: string[] }) => {
    return (
        <div className='flex flex-col gap-5'>
            <NormalInput
                form={form}
                name='fullName'
                title="Full name"
                type='text'
                disabled={readOnlyValues.includes("fullName")}
                placeholder="Full name"
            />
            <div className='flex gap-2 flex-wrap'>

                {!hideForm.includes("email") && <div className='flex-1 min-w-[200px]'>
                    <NormalInput
                        form={form}
                        name='email'
                        title="Email"
                        type='email'
                        disabled={readOnlyValues.includes("email")}
                        placeholder="Email"
                    />
                </div>}


                {!hideForm.includes("phoneNumber") && <div className='flex-1 min-w-[200px]'>
                    <PhoneNumberInput
                        title={"Phone number"}
                        name="phoneNumber"
                        form={form}
                    />
                </div>
                }

            </div>

            {!hideForm.includes("gender") && <div className='flex-1 min-w-[200px]'>
                <RadioInput
                    form={form}
                    name='gender'
                    title="Gender"
                    values={[{
                        data: "Male",
                        value: "male"
                    }, {
                        data: "Female",
                        value: "female"
                    }]}
                    alignment='horizontal'
                />
            </div>}

            {!hideForm.includes("dateOfBirth") && <div className="space-y-2">
                <Label>Date of birth</Label>
                <div className="flex space-x-2">
                    <div className='flex-1'>
                        <FormField
                            control={form.control}
                            name="dateOfBirth.day"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Select
                                            {...field}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            value={field.value}
                                        >
                                            <SelectTrigger id="Day" aria-label="Day">
                                                <SelectValue placeholder="Day" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                                                    <SelectItem key={day} value={day.toString()}>
                                                        {day}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className='flex-1'>
                        <FormField
                            control={form.control}
                            name="dateOfBirth.month"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Select
                                            {...field}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            value={field.value}
                                        >
                                            <SelectTrigger id="Month" aria-label="Month">
                                                <SelectValue placeholder="Month" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                                                    <SelectItem key={month} value={month.toString()}>
                                                        {month}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className='flex-1'>
                        <FormField
                            control={form.control}
                            name="dateOfBirth.year"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Select
                                            {...field}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            value={field.value}
                                        >
                                            <SelectTrigger id="Year" aria-label="Year">
                                                <SelectValue placeholder="Year" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i - 14).map((year) => (
                                                    <SelectItem key={year} value={year.toString()}>
                                                        {year}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>


                </div>
            </div>
            }

        </div>
    )
}
