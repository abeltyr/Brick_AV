"use client";

import * as React from "react";
import { format } from "date-fns"
import { ChevronLeft, ChevronRight, ChevronsUpDownIcon } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/modules/ui/button";
import { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@modules/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@modules/ui/tabs"
import { Separator } from './separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { toEthiopian } from '@/lib/utils/calendar';
import { Badge } from './badge';

const months = [
  { full: "January", abbreviate: "Jan" },
  { full: "February", abbreviate: "Feb" },
  { full: "March", abbreviate: "Mar" },
  { full: "April", abbreviate: "Apr" },
  { full: "May", abbreviate: "May" },
  { full: "June", abbreviate: "Jun" },
  { full: "July", abbreviate: "Jul" },
  { full: "August", abbreviate: "Aug" },
  { full: "September", abbreviate: "Sep" },
  { full: "October", abbreviate: "Oct" },
  { full: "November", abbreviate: "Nov" },
  { full: "December", abbreviate: "Dec" }
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

  const [ethiopiaDate, setEthiopiaDate] = useState<{ date: number, month: number, year: number, } | undefined>();
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

  useEffect(() => {
    if (defaultMonth) {
      const data = toEthiopian({
        date: defaultMonth.getDate(),
        month: defaultMonth.getMonth() + 1,
        year: defaultMonth.getFullYear(),
      })

      if (data && data.date)
        setEthiopiaDate({
          date: data.date!,
          month: data.month,
          year: data.year
        })
    }

  }, [
    defaultMonth
  ])

  return (
    <Popover>
      <div className=' flex flex-col'>
        <div className='flex w-full px-6 py-4 justify-between'>
          <div className='w-32'>
            <Select
              onValueChange={(data) => {
                const value = new Date(parseInt(data), currentMonth.getMonth(), currentMonth.getDate());
                setCurrentMonth(value)
              }}
              defaultValue={currentMonth.getFullYear().toString()}
              value={currentMonth.getFullYear().toString()}
            >
              <SelectTrigger className='bg-transparent px-0 py-0 text-sm
              h-auto w-auto flex gap-2
              border-0 
              focus:ring-0 focus-visible:ring-0 
              focus:border-0 focus-visible:border-0
              focus:ring-offset-0 focus-visible:ring-offset-0
              outline-none focus:outline-none focus-visible:outline-none '>
                Year{" "}
                {currentMonth.getFullYear()}
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i - 0).map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='flex gap-2 text-sm'>
            ET: {ethiopiaDate && <div>
              {ethiopiaDate.date}/{ethiopiaDate.month}/{ethiopiaDate.year}
            </div>}
          </div>
        </div>
        <Separator />
        <div className='flex gap-2'>
          <div className='h-auto w-[212px] p-6 flex flex-col gap-4'>
            <p className='text-lg text-[#A8A29E] '>
              Month
            </p>
            <div className="grid grid-cols-3 gap-x-3 gap-y-4">
              {months.map((data, index) => {
                const monthData = format(currentMonth, "MMMM");
                return <Button key={index}
                  variant={monthData === data.full ? "secondary" : "ghost"}
                  className={`flex-1 rounded-sm ${monthData === data.full ? "bg-[#F4F4F5] border-[1px] border-[#0C0A09] text-[#09090B]" : ""}`}
                  onClick={() => {
                    const value = new Date(currentMonth.getFullYear(), index, currentMonth.getDate());
                    setCurrentMonth(value)
                  }}
                >
                  {data.abbreviate}
                </Button>
              })}
            </div>
          </div>
          <Separator orientation={"vertical"} className=' h-auto' />
          <div className='p-0'>
            <DayPicker
              // selected={selectedDate}

              month={currentMonth} // Controlled month
              onMonthChange={setCurrentMonth}
              showOutsideDays={showOutsideDays}
              className={cn("p-6", className)}
              classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4",
                caption: "flex justify-center pt-1 relative items-center",
                caption_label: "text-sm font-medium",
                nav: "space-x-1 flex items-center ",
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
              // captionLayout="dropdown"
              {...props}
            />
          </div>
        </div>
      </div>
    </Popover>
  );
}
Calendar.displayName = "Calendar";

export { Calendar };