import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/modules/ui/form';
import { Input } from '@/modules/ui/input';
import { Textarea } from '@/modules/ui/textarea';
import React from 'react'

export const NormalTextAreaInput = ({
    title,
    form,
    name,
    placeholder,
    disabled = false,
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
                        <Textarea
                            {...field}
                            id="description"
                            className="min-h-32"
                            disabled={disabled}
                            placeholder={placeholder}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
