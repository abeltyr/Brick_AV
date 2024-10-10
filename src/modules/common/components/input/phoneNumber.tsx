import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/modules/ui/form';
import { Input } from '@/modules/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/modules/ui/select';
import React from 'react'

export const PhoneNumberInput = ({
    title = "Phone number",
    form,
    name = "phoneNumber",
    placeholder = "911223344",
    disabled = false,
    description
}: {
    title?: string,
    form: any,
    name?: string,
    placeholder?: string
    disabled?: boolean
    description?: string
}
) => {
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>

                    {title && <FormLabel className='text-sm'>
                        <p>{title}
                        </p>
                        {description && <p className='text-xs text-[#71717A] font-light'>
                            {description}
                        </p>}
                    </FormLabel>}
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
