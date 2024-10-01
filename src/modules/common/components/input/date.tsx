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

export const DatePickerInput = (
    {
        title,
        name,
        form,
        disabled = false,
        placeholder = "DD-MM-YYYY"
    }: {
        form: any,
        disabled?: boolean
        title?: string,
        name: string,
        placeholder?: string
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
            name="date"
            render={({ field }) => (
                <FormItem className='flex  flex-col gap-1'>
                    {title && <FormLabel className='text-sm'>
                        <LanguageTranslator>
                            {title}
                        </LanguageTranslator>
                    </FormLabel>}
                    <FormControl >
                        <Popover >
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"secondary"}
                                    className={cn(
                                        "w-[full] justify-start text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {field.value ? format(field.value, "MMM dd, yyyy") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    initialFocus
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


{/* <Popover open={opened} modal={opened} onOpenChange={setOpened}>

<div className="relative">
    <PopoverTrigger asChild>
        <CalendarIcon className="cursor-pointer absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" onClick={() => {
            setOpened(true)
        }} />
    </PopoverTrigger>
    <Input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        className="pl-10 pr-3 w-[180px]"
        placeholder={placeholder}
    />
</div>
<PopoverContent className="w-auto p-0" align="start">
    <Calendar
        mode="single"
        selected={date}
        onSelect={handleDateSelect}
        initialFocus={true}
        showOutsideDays={true}
        className='day_outside'
    />
</PopoverContent>
</Popover > */}