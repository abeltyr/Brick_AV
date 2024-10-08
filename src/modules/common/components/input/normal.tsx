import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/modules/ui/form';
import { Input } from '@/modules/ui/input';
import React from 'react'

export const NormalInput = ({
    title,
    description,
    form,
    name,
    placeholder,
    disabled = false,
    type
}: {
    title?: string,
    description?: string,
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
                    {title && <FormLabel className='text-sm'>
                        <p>{title}
                        </p>
                        {description && <p className='text-xs text-[#71717A] font-light'>
                            {description}
                        </p>}
                    </FormLabel>}
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
