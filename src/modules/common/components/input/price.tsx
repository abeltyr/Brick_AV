import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/modules/ui/form';
import { Input } from '@/modules/ui/input';
import React from 'react'

export const PriceInput = ({
    title,
    form,
    name,
    placeholder,
    disabled = false
}: {
    title: string,
    form: any,
    name: string,
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
                        <Input
                            disabled={disabled}
                            placeholder={placeholder}
                            {...field}
                            type="number"
                            step="1"
                            onChange={(e) => {
                                const value = e.target.value;
                                field.onChange(value === "" ? undefined : Number(value));
                            }}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
