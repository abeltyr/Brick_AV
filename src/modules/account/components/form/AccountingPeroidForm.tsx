"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/modules/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Form,
    FormControl,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/modules/ui/form"
import yearSchema from '@/lib/form/account/accountPeriod'
import { Input } from '@/modules/ui/input'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { DatePickerInput } from '@/modules/common/components/input/date'
import { secondsInADay, secondsInAMonth, secondsInAYear } from '@/lib/utils/calendar/date'
import { useEffect } from 'react'


interface OnboardingAccountingPeriodFormProps extends React.HTMLAttributes<HTMLDivElement> { }

export function OnboardingAccountingPeriodForm({ className, ...props }: OnboardingAccountingPeriodFormProps) {


    const form = useForm<z.infer<typeof yearSchema>>({
        resolver: zodResolver(yearSchema),
        defaultValues: {
        },
    })


    const { fields, append, remove, update, insert, } = useFieldArray({
        control: form.control,
        name: "periods",
    });


    const onSubmit = (data: FormData) => {
        console.log("Form data:", data);
    };


    const watchedStartDate = useWatch({
        control: form.control,
        name: "startDate",
    });


    useEffect(() => {

        if (watchedStartDate) {
            form.setValue("endDate", (new Date(watchedStartDate.getTime() + secondsInAYear * 1000 - secondsInADay * 1000)))

            // let month1 = {
            //     start: watchedStartDate,
            //     end: new Date(watchedStartDate.getTime() + secondsInAMonth * 1000)
            // };

            // let date1 = new Date(month1.end.getTime() + secondsInADay * 1000);
            // let month2 = {
            //     start: date1,
            //     end: (new Date(date1.getTime() + secondsInAMonth * 1000))
            // };

            // let date2 = new Date(month2.end.getTime() + secondsInADay * 1000);

            // update(0, {
            //     start: month1.start,
            //     end: month1.end
            // })


            // update(1, {
            //     start: month2.start,
            //     end: month2.end
            // }
            // )



            let currentDate = new Date(watchedStartDate); // Start from the watched start date

            for (let i = 0; i < 12; i++) {
                let monthStart = new Date(currentDate); // Set the start of the month

                // Set the end of the month by moving to the next month and subtracting a day

                // Set the end of the month by moving exactly one month ahead, and subtracting one day
                let monthEnd = new Date(monthStart);
                monthEnd.setMonth(monthEnd.getMonth() + 1); // Move to the next month on the same day
                monthEnd.setDate(monthEnd.getDate() - 1); // Subtract one day to get the correct end date

                // Update for the current month
                update(i, {
                    start: monthStart,
                    end: monthEnd
                });

                // Move to the next month start (which is the day after the current month's end)
                currentDate = new Date(monthEnd);
                currentDate.setDate(currentDate.getDate() + 1); // Move to the first day of the next month
            }

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [watchedStartDate])

    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <Form {...form}>
                {/* Year Start Date */}
                <div className='flex w-full gap-10'>

                    <div className='max-w-[312px] flex gap-4'>
                        <div className='flex flex-col gap-2 pt-1 items-center'>
                            <div className='w-3 h-3 bg-[#D9D9D9] rounded-full' />
                            <div className='w-[2px] h-16 bg-[#D9D9D9]' />
                            <div className='w-3 h-3 bg-[#D9D9D9] rounded-full' />
                        </div>
                        <div className='flex flex-col gap-5'>
                            <DatePickerInput
                                form={form}
                                name='startDate'
                                title='Start date'
                                variant={"outline"}
                                placeholder='Choose Start Date'
                            />

                            <DatePickerInput
                                form={form}
                                name='endDate'
                                title='End date'
                                variant={"outline"}
                                placeholder='Choose End Date'
                                minDate={watchedStartDate ? new Date(watchedStartDate.getTime() + secondsInAMonth * 1000 * 2) : new Date()}
                            />
                        </div>

                        {/* Button to add a new accounting period */}
                        {/* <Button
                            type="button"
                            onClick={() => append({ start: new Date(), end: new Date() })}
                            className="mb-4"
                        >
                            Add Accounting Period
                        </Button> */}

                        {/* Submit Button */}
                        {/* <Button type="submit" className="mt-4">Submit</Button> */}
                    </div>
                    <div>
                        {fields.map((field, index) => (
                            <div key={field.id} className="mb-4">
                                <div className='flex items-center gap-3 h-full'>
                                    <div className='items-center h-full '>
                                        {index + 1}
                                    </div>
                                    <DatePickerInput
                                        form={form}
                                        name={`periods.${index}.start`}
                                        variant={"outline"}
                                        placeholder='Choose Start Date'
                                    />

                                    <DatePickerInput
                                        form={form}
                                        name={`periods.${index}.end`}
                                        variant={"outline"}
                                        placeholder='Choose End Date'
                                    />
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={() => insert(index + 1, { start: new Date(), end: new Date() })}
                                    >
                                        +
                                    </Button>

                                    {fields.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            onClick={() => remove(index)}
                                        >
                                            x
                                        </Button>
                                    )}
                                </div>

                            </div>
                        ))}
                    </div>
                </div>
            </Form>
        </div>
    )
}
