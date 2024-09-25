import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/modules/ui/form';
import { Input } from '@/modules/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/modules/ui/select';
import React from 'react'

export const PhoneNumberInput = ({
    title = "Phone number",
    form,
    name = "phoneNumber",
    placeholder = "922998885",
    disabled = false
}: {
    title?: string,
    form: any,
    name?: string,
    placeholder?: string
    disabled?: boolean
}
) => {
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel className='text-sm'>{title}</FormLabel>
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
                                disabled={disabled}
                                placeholder={placeholder}
                                className="flex-1 ml-1"
                            />
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
