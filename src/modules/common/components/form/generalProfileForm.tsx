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
import { RadioGroup, RadioGroupItem } from '@/modules/ui/radio-group'
import { Input } from "@/modules/ui/input"
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'


export const GeneralProfileForm = ({ form }: { form: UseFormReturn<z.infer<typeof profileSchema>> }) => {
    return (
        <div className='flex flex-col gap-5'>
            <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className='text-sm'>Full name</FormLabel>
                        <FormControl>
                            <Input
                                placeholder="Enter your full name"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}

            />
            <div className='flex gap-2 flex-wrap'>
                <div className='flex-1 min-w-[200px]'>
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='text-sm'>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter your email"
                                        {...field}
                                        type="email"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className='flex-1 min-w-[200px]'>
                    <FormField
                        control={form.control}
                        name="tinNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='text-sm'>Personal Tin number</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter your TIN number"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

            </div>
            <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className='text-sm'>Phone number</FormLabel>
                        <FormControl>
                            <div className='flex '>
                                <Select>
                                    <SelectTrigger className="w-[100px]">
                                        <SelectValue placeholder="🇪🇹 +251" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="eth">🇪🇹 +251</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Input
                                    {...field}
                                    placeholder="922998885"
                                    className="flex-1 ml-2"
                                />
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <div className="space-y-2">
                <Label>Gender</Label>
                <RadioGroup defaultValue="male" className='flex gap-2'>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" {...form.register('gender')} />
                        <Label htmlFor="male">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" {...form.register('gender')} />
                        <Label htmlFor="female">Female</Label>
                    </div>
                </RadioGroup>
            </div>
            {/* 
            <FormField
                control={form.control}
                name="dateOfBirth"
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
            /> */}

            <div className="space-y-2">
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

        </div>
    )
}
