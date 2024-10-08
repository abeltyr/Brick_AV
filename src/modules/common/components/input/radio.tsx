import { LanguageTranslator } from '@/modules/language/components';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/modules/ui/form';
import { Label } from '@/modules/ui/label';
import { RadioGroup, RadioGroupItem } from '@/modules/ui/radio-group';
import React from 'react'

export const RadioInput = ({
    title,
    description,
    form,
    name,
    values,
    alignment = "vertical"
}: {
    title: string,
    form: any,
    name: string,
    description?: string,
    values: {
        data: string,
        value: string,
        onClick?: () => void
    }[]
    alignment: "vertical" | "horizontal"
}
) => {
    return (
        <FormField control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem >
                    <FormLabel className='text-sm font-medium'>
                        <LanguageTranslator>
                            {title}
                        </LanguageTranslator>

                        {description && <p className='text-sm text-[#71717A] font-light'>
                            {description}
                        </p>}
                    </FormLabel>
                    <FormControl className='pt-2'>
                        <RadioGroup
                            className={`flex ${alignment === "vertical" ? "flex-col gap-4 " : "gap-6"}`}
                            {...field}
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                        >
                            {values.map((data, index) => {
                                return <div key={index} className="flex items-center space-x-2">
                                    <RadioGroupItem
                                        value={data.value}
                                        id={data.value}
                                        onClick={() => {
                                            if (data.onClick) data.onClick()
                                        }}
                                    />
                                    <Label htmlFor={data.value} className='text-sm font-medium'>{data.data}</Label>
                                </div>
                            })}
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
