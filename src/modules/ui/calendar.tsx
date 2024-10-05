"use client";

import * as React from "react";
import { format } from "date-fns"
import { ChevronLeft, ChevronRight, ChevronsUpDownIcon } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/modules/ui/button";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@modules/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@modules/ui/tabs"


const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  defaultMonth,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [currentMonth, setCurrentMonth] = useState(defaultMonth ? new Date(defaultMonth) : new Date());

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(Number(e.target.value));
    setCurrentMonth(newMonth);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = new Date(currentMonth);
    newYear.setFullYear(Number(e.target.value));
    setCurrentMonth(newYear);
  };


  return (
    <Popover>
      <div>
        <div className='absolute top-3.5 z-10 w-[60%] flex justify-center left-[20%] right-[20%]'>
          <PopoverTrigger >
            <div className='bg-white text-xs font-light flex gap-3 items-center cursor-pointer select-none border-[1px] border-black/50 px-2 py-1 rounded-md'>
              <div>
                {
                  format(currentMonth, "MMMM yyyy")
                }
              </div>
              <ChevronsUpDownIcon className='w-3 h-3' />
            </div>
          </PopoverTrigger>
        </div>

        <PopoverContent className='p-0 w-[275px] overflow-hidden'>
          <Tabs defaultValue="account" className="w-[full]">
            <TabsList className='w-full'>
              <TabsTrigger value="month" className='w-1/2'>Month</TabsTrigger>
              <TabsTrigger value="year" className='w-1/2'>Year</TabsTrigger>
            </TabsList>
            <TabsContent value="year" className='p-0 mt-2'>
              <div className="flex gap-1 p-1 justify-center mb-0 h-[300px] flex-wrap overflow-x-hidden overflow-y-auto">
                {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i - 0).map((data, index) => {
                  const yearData = format(currentMonth, "yyyy");
                  return <Button key={index}
                    variant={yearData === data.toString() ? "default" : "outline"}
                    className='flex-1 h-[70px] min-w-[32%] rounded-sm'
                    onClick={() => {
                      const value = new Date(data, currentMonth.getMonth(), currentMonth.getDate());
                      setCurrentMonth(value)
                    }}
                  >
                    {data}
                  </Button>
                })}
              </div>
            </TabsContent>
            <TabsContent value="month" className='p-0 mt-2'>
              <div className="flex gap-1 p-1 justify-center mb-0 h-[300px] flex-wrap overflow-x-hidden overflow-y-auto">
                {months.map((data, index) => {
                  const monthData = format(currentMonth, "MMMM");
                  return <Button key={index}
                    variant={monthData === data ? "default" : "outline"}
                    className='flex-1 h-[70px] min-w-[32%] rounded-sm'
                    onClick={() => {
                      const value = new Date(currentMonth.getFullYear(), index, currentMonth.getDate());
                      setCurrentMonth(value)
                    }}
                  >
                    {data}
                  </Button>
                })}
              </div>
            </TabsContent>
          </Tabs>

        </PopoverContent>

        <DayPicker
          // selected={selectedDate}
          month={currentMonth} // Controlled month
          onMonthChange={setCurrentMonth}
          showOutsideDays={showOutsideDays}
          className={cn("p-3", className)}
          classNames={{
            months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
            month: "space-y-4",
            caption: "flex justify-center pt-1 relative items-center",
            caption_label: "text-sm font-medium",
            nav: "space-x-1 flex items-center",
            nav_button: cn(
              buttonVariants({ variant: "outline" }),
              "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
            ),
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse space-y-1",
            head_row: "flex",
            head_cell:
              "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
            row: "flex w-full mt-2",
            cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
            day: cn(
              buttonVariants({ variant: "ghost" }),
              "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
            ),
            day_range_end: "day-range-end",
            day_selected:
              "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
            day_today: "bg-accent text-accent-foreground",
            day_outside:
              "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
            day_disabled: "text-muted-foreground opacity-50",
            day_range_middle:
              "aria-selected:bg-accent aria-selected:text-accent-foreground",
            day_hidden: "invisible",
            ...classNames,
          }}
          components={{
            IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
            IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
          }}
          captionLayout="dropdown"
          {...props}
        />
      </div>
    </Popover>
  );
}
Calendar.displayName = "Calendar";

export { Calendar };