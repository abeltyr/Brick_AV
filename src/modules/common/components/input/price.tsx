import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/modules/ui/form';
import { Input } from '@/modules/ui/input';
import React from 'react'

export const PriceInput = ({
    title,
    form,
    name,
    placeholder,
    disabled = false,
    description
}: {
    title?: string,
    form: any,
    name: string,
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
                        {title}

                        {description && <p className='text-xs text-[#71717A] font-light'>
                            {description}
                        </p>}
                    </FormLabel>}
                    <FormControl>
                        <Input
                            disabled={disabled}
                            placeholder={placeholder}
                            {...field}
                            type="number"
                            step="1"
                            onChange={(e) => {
                                const value = e.target.value;
                                console.log("value", value)
                                if (value === "") {
                                    console.log("value", value)
                                    field.onChange("");
                                }
                                else {
                                    field.onChange(Number(value));
                                }
                            }}
                            onBlur={(e) => {
                                let value = e.target.value;
                                if (value === "")
                                    field.onChange(0);
                                field.onBlur();
                            }}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
