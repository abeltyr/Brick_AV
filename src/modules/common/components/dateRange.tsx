"use client"

import * as React from "react"
import { CalendarIcon, CheckIcon } from "@radix-ui/react-icons"
import { addDays, format } from "date-fns"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/modules/ui/button"
import { Calendar } from "@/modules/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/modules/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/modules/ui/command'
import { usePurchases } from '@/lib/context/purchase'
import { monthConverter } from '@/lib/utils/calendar/month'

export function CalendarDateRangePicker({
    className,
}: React.HTMLAttributes<HTMLDivElement>) {
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: new Date(2023, 0, 20),
        to: addDays(new Date(2023, 0, 20), 20),
    })

    const { updateMonth, updateYear, month, year } = usePurchases()


    return (
        <div className={cn("flex gap-2", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-[120px] justify-start text-left font-normal gap-1",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {monthConverter(month)}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                    <Command>
                        <CommandList className='max-h-[500px]'>
                            <CommandGroup >
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((date, index) => (
                                    <CommandItem
                                        key={index}
                                        onSelect={() => {
                                            updateMonth(date)
                                        }}
                                        className={`text-sm group gap-3 min-w-[150px] cursor-pointer ${month === date ? "bg-foreground/80 data-[selected='true']:bg-foreground data-[selected='true']:text-background text-background" : ""}`}
                                    >

                                        {monthConverter(date)}
                                        <CheckIcon
                                            className={cn(
                                                "ml-auto h-4 w-4",
                                                month === date
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-[100px] justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {year}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                    <Command>
                        <CommandList>
                            <CommandGroup >
                                {[2017, 2016].map((date, index) => (
                                    <CommandItem
                                        key={index}
                                        onSelect={() => {
                                            updateYear(date)
                                        }}
                                        className={`text-sm group gap-3 min-w-[150px] cursor-pointer ${month === date ? "bg-foreground/80 data-[selected='true']:bg-foreground data-[selected='true']:text-background text-background" : ""}`}
                                    >

                                        {date}
                                        <CheckIcon
                                            className={cn(
                                                "ml-auto h-4 w-4",
                                                year === date
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}