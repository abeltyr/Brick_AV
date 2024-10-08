import React from 'react'
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/modules/ui/form"
import { ownerSchema } from '@/lib/form/account'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { LanguageTranslator } from '@/modules/language/components'
import { Label } from '@/modules/ui/label'
import { RadioGroup, RadioGroupItem } from '@/modules/ui/radio-group'
import { Textarea } from '@/modules/ui/textarea'


export const GeneralRoleForm = ({ form, watchedRole }: { form: UseFormReturn<z.infer<typeof ownerSchema>>, watchedRole: string }) => {
    return (
        <div className='flex flex-col gap-5'>
            <div className="space-y-2">
                <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-sm'>
                                <LanguageTranslator>
                                    What is your role in the company?
                                </LanguageTranslator></FormLabel>
                            <FormControl>
                                <RadioGroup
                                    className='flex flex-col gap-4'
                                    {...field}
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    value={field.value}
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem
                                            value="owner"
                                            id="owner"
                                        />
                                        <Label htmlFor="owner">Owner</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem
                                            value="accountant"
                                            id="accountant"
                                        />
                                        <Label htmlFor="accountant">Accountant</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem
                                            value="other"
                                            id="other"
                                        />
                                        <Label htmlFor="other">Other</Label>
                                    </div>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            {watchedRole === 'other' && <FormField
                control={form.control}
                name="detail"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className='text-sm'>
                            <LanguageTranslator>
                                Write you’re role in the company
                            </LanguageTranslator></FormLabel>
                        <FormControl>
                            <Textarea
                                {...field}
                                id="description"
                                placeholder="Assistant, CTO... ETC"
                                className="min-h-32"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />}

        </div>
    )
}
