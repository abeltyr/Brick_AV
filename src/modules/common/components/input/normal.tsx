import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/modules/ui/form';
import { Input } from '@/modules/ui/input';
import React from 'react'

export const NormalInput = ({
    title,
    form,
    name,
    placeholder,
    disabled = false,
    type
}: {
    title: string,
    form: any,
    name: string,
    placeholder?: string
    disabled?: boolean
    type: string
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
                            type={type}
                            disabled={disabled}
                            placeholder={placeholder}
                            {...field}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
