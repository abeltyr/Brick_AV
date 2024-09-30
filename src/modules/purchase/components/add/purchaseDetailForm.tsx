
import { LanguageTranslator } from '@/modules/language/components'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/modules/ui/card"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/modules/ui/form'
import { Input } from "@/modules/ui/input"
import { Textarea } from '@/modules/ui/textarea'
import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/modules/ui/button"
import { Calendar } from "@/modules/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/modules/ui/popover"
import { purchaseFormSchema } from '@/lib/form/purchase'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'


export default function PurchaseDetailForm({ form }: { form: UseFormReturn<z.infer<typeof purchaseFormSchema>> }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <LanguageTranslator>
                        Purchase Detail
                    </LanguageTranslator>
                </CardTitle>
                <CardDescription>
                    <LanguageTranslator>
                        Provided the needed Purchase Detail
                    </LanguageTranslator>
                </CardDescription>
            </CardHeader>
            {/* <CardContent>
                <div className="grid gap-6">
                    <div className="gap-3 flex">
                        <div className='flex-1'>
                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem className='flex  flex-col gap-1'>
                                        <FormLabel className='text-sm'>
                                            <LanguageTranslator>
                                                Date
                                            </LanguageTranslator>
                                        </FormLabel>
                                        <FormControl >
                                            <Popover >
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-[full] justify-start text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
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

                        </div>
                        <div className='flex-1'>
                            <FormField
                                control={form.control}
                                name="invoiceNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='text-sm'>
                                            <LanguageTranslator>
                                                Invoice Number
                                            </LanguageTranslator></FormLabel>
                                        <FormControl>
                                            <Input type="text" placeholder="0001" {...field} className='px-4 py-3 focus:ring-0 focus:outline-none focus:border-0
                      ring-0 text-sm font-light placeholder:text-neutral-400' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className='flex-1'>
                            <FormField
                                control={form.control}
                                name="withholdingNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='text-sm'>
                                            <LanguageTranslator>
                                                Withholding Receipt Number
                                            </LanguageTranslator>
                                        </FormLabel>
                                        <FormControl>
                                            <Input type="text" placeholder="1" {...field} className='px-4 py-3 focus:ring-0 focus:outline-none focus:border-0
                      ring-0 text-sm font-light placeholder:text-neutral-400' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <div className="gap-3 flex">
                        <div className='flex-1'>
                            <FormField
                                control={form.control}
                                name="MRCNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='text-sm'>
                                            <LanguageTranslator>
                                                MRC Number
                                            </LanguageTranslator></FormLabel>
                                        <FormControl>
                                            <Input type="text" placeholder="MR000a21" {...field} className='px-4 py-3 focus:ring-0 focus:outline-none focus:border-0 ring-0 text-sm font-light placeholder:text-neutral-400' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className='flex-1'>
                            <FormField
                                control={form.control}
                                name="VatReceiptNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='text-sm'>
                                            <LanguageTranslator>
                                                Vat Receipt Number
                                            </LanguageTranslator>
                                        </FormLabel>
                                        <FormControl>
                                            <Input type="text" placeholder="Fs0001212" {...field} className='px-4 py-3 focus:ring-0 focus:outline-none focus:border-0
                      ring-0 text-sm font-light placeholder:text-neutral-400' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                </div>

            </CardContent> */}
        </Card>
    )
}
