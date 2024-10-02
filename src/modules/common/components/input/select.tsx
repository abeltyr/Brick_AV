import { LanguageTranslator } from '@/modules/language/components';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/modules/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/modules/ui/select';
import React from 'react'

export const SelectInput = ({
    title,
    form,
    name,
    values,
    selectTitle
}: {
    title: string,
    form: any,
    name: string,
    selectTitle: { name: string, value: string }
    values: {
        data: string,
        value: string,
    }[]
}
) => {
    return (
        <FormField control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel className='text-sm '>
                        <LanguageTranslator>
                            {title}
                        </LanguageTranslator>
                    </FormLabel>
                    <FormControl>
                        <Select
                            {...field}
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                        >
                            <SelectTrigger id={selectTitle.value} aria-label={selectTitle.name}  >
                                <SelectValue placeholder={selectTitle.name} className='text-[#71717A] text-sm' />
                            </SelectTrigger>
                            <SelectContent>
                                {values.map((value, index) => {
                                    return (
                                        <SelectItem value={value.value} key={index}>
                                            {value.data}
                                        </SelectItem>
                                    )
                                })}
                            </SelectContent>
                        </Select>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
