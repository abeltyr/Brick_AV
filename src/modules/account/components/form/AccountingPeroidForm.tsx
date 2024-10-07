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
import { ArrowRight } from 'lucide-react'
import ArrowRightSVG from '@/assets/icons/arrowRight'
import AddCircleSVG from '@/assets/icons/addCircle'
import RemoveSVG from '@/assets/icons/trash'
import { ErrorMessage } from '@/modules/common/components/errorMessage'

function monthsBetweenDates(startDate: Date, endDate: Date): number {
    const startYear = startDate.getFullYear();
    const startMonth = startDate.getMonth();
    const startDay = startDate.getDate();

    const endYear = endDate.getFullYear();
    const endMonth = endDate.getMonth();
    const endDay = endDate.getDate();

    // Calculate the total number of months between the years and months
    let monthsDifference = (endYear - startYear) * 12 + (endMonth - startMonth);

    // Handle edge case where the end date's day is less than the start date's day
    if (endDay < startDay) {
        monthsDifference -= 1;
    }

    return monthsDifference;
}

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




    const onSubmit = async (values: z.infer<typeof yearSchema>) => {

        console.log("Form data:", values);
        try {

        } catch (e) {
            console.log(e)
        }
    }

    const watchedStartDate = useWatch({
        control: form.control,
        name: "startDate",
    });


    const watchedEndDate = useWatch({
        control: form.control,
        name: "endDate",
    });


    useEffect(() => {

        if (watchedStartDate) {
            let currentDate = new Date(watchedStartDate); // Start from the watched start date
            let indexLength = 12;
            if (watchedEndDate && watchedEndDate.getTime() > watchedStartDate.getTime() + secondsInAMonth * 3 * 1000) {
                indexLength = monthsBetweenDates(watchedStartDate, watchedEndDate);
            } else {
                indexLength = 12
                form.setValue("endDate", (new Date(watchedStartDate.getTime() + secondsInAYear * 1000 - secondsInADay * 1000)))
            }


            for (let i = 0; i < indexLength + 1; i++) {
                let monthStart = new Date(currentDate); // Set the start of the month

                // Set the end of the month by moving to the next month and subtracting a day

                // Set the end of the month by moving exactly one month ahead, and subtracting one day
                let monthEnd = new Date(monthStart);
                monthEnd.setMonth(monthEnd.getMonth() + 1); // Move to the next month on the same day
                monthEnd.setDate(monthEnd.getDate() - 1); // Subtract one day to get the correct end date


                // Update for the current month
                update(i, {
                    start: monthStart,
                    end: i === indexLength && watchedEndDate && watchedEndDate.getTime() > watchedStartDate.getTime() + secondsInAMonth * 3 * 1000 ? watchedEndDate : monthEnd
                });


                // Move to the next month start (which is the day after the current month's end)
                currentDate = new Date(monthEnd);
                currentDate.setDate(currentDate.getDate() + 1); // Move to the first day of the next month
            }

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [watchedStartDate])

    useEffect(() => {

        if (watchedEndDate && watchedStartDate) {
            let currentDate = new Date(watchedStartDate); // Start from the watched start date
            let endDate = new Date(watchedEndDate); // End date from the watched end date

            form.setValue("periods", []); // Reset the form periods array
            let index = 0;
            // Loop through and create periods
            while (currentDate < endDate) {
                let monthStart = new Date(currentDate); // Start date of the current period

                // Try to make the period 30 days long, but ensure it doesn't go beyond the end date
                let monthEnd = new Date(monthStart);
                monthEnd.setDate(monthEnd.getDate() + 29); // Set the end date to 30 days from the start
                if (monthEnd > endDate) {
                    monthEnd = new Date(endDate); // Adjust the last period to match the exact end date
                }

                // Add period to form or array
                update(index, {
                    start: monthStart,
                    end: monthEnd
                });

                // Move to the next period start date (day after current period end)
                currentDate = new Date(monthEnd);
                currentDate.setDate(currentDate.getDate() + 1); // Start at the next day after current period's end
                index++;
            }


        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [watchedEndDate])

    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <Form {...form}>
                {/* Year Start Date */}
                <div className='flex w-full gap-10'>
                    <div className='flex flex-col gap-8'>
                        <div className='max-w-[312px] flex gap-4'>
                            <div className='flex flex-col gap-2 pt-1 items-center'>
                                <div className='w-3 h-3 bg-[#D9D9D9] rounded-full' />
                                <div className={`w-[2px] ${watchedStartDate ? "h-[64px]" : "h-12"} bg-[#D9D9D9] transition-all duration-300`} />
                                <div className={`${watchedStartDate ? "scale-100" : "scale-0"} w-3 h-3 bg-[#D9D9D9] rounded-full transition-all duration-300`} />
                            </div>
                            <div className='flex flex-col gap-5 w-[284px]'>
                                <div className='w-[284px]'>
                                    <DatePickerInput
                                        form={form}
                                        name='startDate'
                                        title='Start date'
                                        variant={"outline"}
                                        parent={`periods`}
                                        placeholder='Choose Start Date'

                                    />
                                </div>
                                {watchedStartDate &&
                                    <div className='w-[284px]'>
                                        <DatePickerInput
                                            form={form}
                                            name='endDate'
                                            title='End date'
                                            variant={"outline"}
                                            parent={`periods`}
                                            placeholder='Choose End Date'
                                            minDate={watchedStartDate ? new Date(watchedStartDate.getTime() + secondsInAMonth * 1000 * 2) : new Date()}
                                        />
                                    </div>}
                            </div>

                        </div>

                        <Button
                            disabled={!watchedStartDate}
                            type="submit" variant='default'
                            onClick={() => {
                                form.clearErrors();
                                console.log(form.formState)
                                form.handleSubmit(onSubmit)()
                                console.log(form.formState)
                            }}
                        >
                            Continue
                        </Button>
                    </div>
                    {fields.length > 0 && <ArrowRightSVG className=' mt-32 text-[#A8A29E] stroke-1' />}
                    {fields.length > 0 &&
                        <div className='flex flex-col gap-4 justify-start'>
                            <div>
                                <p className='text-lg text-[#09090B]'>
                                    Edit Accounting Period
                                </p>
                                {form.formState.errors.periods && <ErrorMessage message='Accounting periods cannot overlap or have gaps' />}
                            </div>
                            {fields.map((field, index) => (
                                <div key={field.id} className="mb-4 flex items-center gap-2 h-full">
                                    <div className='h-full flex items-center justify-center'>
                                        <p className='text-[#A8A29E] text-sm  select-none'>
                                            {index + 1}.
                                        </p>
                                    </div>

                                    <div className='min-w-[180px] flex-1'>
                                        <DatePickerInput
                                            form={form}
                                            name={`periods.${index}.start`}
                                            parent={`periods`}
                                            variant={"outline"}
                                            placeholder='Choose Start Date'
                                            disabled={index === 0}
                                        />
                                    </div>
                                    <ArrowRightSVG className=' text-[#A8A29E] stroke-1' />
                                    <div className='min-w-[180px] flex-1'>
                                        <DatePickerInput
                                            form={form}
                                            name={`periods.${index}.end`}
                                            parent={`periods`}
                                            variant={"outline"}
                                            placeholder='Choose End Date'
                                            disabled={index === fields.length - 1}
                                        />
                                    </div>
                                    <div className='flex gap-2 items-center'>

                                        <AddCircleSVG
                                            className='text-[#A8A29E] stroke-1 cursor-pointer'
                                            onClick={() => insert(index + 1, { start: new Date(new Date(form.getValues(`periods.${index}.end`)).getTime() + secondsInADay * 1000), end: new Date(new Date(form.getValues(`periods.${index}.end`)).getTime() + 30 * secondsInADay * 1000) })}
                                        />
                                        {!(index === 0 || fields.length - 1 === index) ? (
                                            <RemoveSVG className=' text-[#A8A29E] stroke-1 cursor-pointer' onClick={() => remove(index)} />
                                        ) : <div className="w-5 h-5" />}
                                    </div>
                                </div>
                            ))}
                        </div>}
                </div>
            </Form>
        </div>
    )
}
