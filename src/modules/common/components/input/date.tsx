"use client"

import * as React from "react"
import { format, parse } from "date-fns"
import { ArrowDown, Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/modules/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/modules/ui/popover"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/modules/ui/form';
import { LanguageTranslator } from '@/modules/language/components'
import { Button } from '@/modules/ui/button'
import { cn } from '@/lib/utils'
import { Input } from '@/modules/ui/input'

export const DatePickerInput = (
    {
        title,
        name,
        form,
        disabled = false,
        placeholder = "DD-MM-YYYY",
        variant = "secondary",
        maxDate,
        minDate = new Date("10/10/1900"),
        parent
    }: {
        form: any,
        disabled?: boolean
        title?: string,
        name: string,
        placeholder?: string
        minDate?: Date
        maxDate?: Date
        variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null | undefined,
        parent?: string
    }) => {
    const [date, setDate] = React.useState<Date>()
    const [opened, setOpened] = React.useState<boolean>(false)
    const [inputValue, setInputValue] = React.useState<string>("")

    const handleDateSelect = (selectedDate: Date | undefined) => {
        setDate(selectedDate)
        setInputValue(selectedDate ? format(selectedDate, "dd-MM-yyyy") : "")
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        setInputValue(value)

        const parsedDate = parse(value, "dd-MM-yyyy", new Date())
        if (!isNaN(parsedDate.getTime())) {
            setDate(parsedDate)
        } else {
            setDate(undefined)
        }
    }

    return (

        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className='flex  flex-col gap-1'>
                    {title && <FormLabel className='text-sm'>
                        <LanguageTranslator>
                            {title}
                        </LanguageTranslator>
                    </FormLabel>}
                    <FormControl >
                        <Popover >
                            <PopoverTrigger asChild disabled={disabled}>
                                <Button
                                    variant={variant}
                                    className={cn(
                                        "w-[full] justify-start text-left font-normal gap-2",
                                        !field.value && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="h-4 w-4" />
                                    {field.value ? format(field.value, "MMMM dd, yyyy") : <span>{placeholder}</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={(data) => {
                                        field.onChange(data)
                                        if (parent) form.trigger(parent)
                                    }}
                                    defaultMonth={field.value}
                                    initialFocus
                                    disabled={{
                                        before: minDate,
                                        after: maxDate
                                    }}
                                />
                            </PopoverContent>
                        </Popover>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
