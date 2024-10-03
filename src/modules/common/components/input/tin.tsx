import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/modules/ui/form';
import { Input } from '@/modules/ui/input';
import React from 'react'

export const ZeroAdjustableInput = ({
    title,
    form,
    name,
    placeholder = "TAX Identification Number ('TIN')",
    lengthData = 10
}: {
    title?: string,
    form: any,
    name: string,
    placeholder?: string
    lengthData?: number
}
) => {
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    {title && <FormLabel className='text-sm'>{title}</FormLabel>}
                    <FormControl>
                        <Input
                            placeholder={placeholder}
                            {...field}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                const value = e.target.value.replace(/\D/g, ''); // Remove non-digit characters
                                field.onChange(value);
                            }}
                            onBlur={(e) => {
                                let value = e.target.value.replace(/^0+/, ''); // Remove leading zeros
                                const paddedValue = value.padStart(lengthData, '0');
                                field.onChange(paddedValue);
                                field.onBlur();
                            }}
                            maxLength={lengthData}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
