import React from 'react'
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/modules/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/modules/ui/select'
import { profileSchema } from '@/lib/form/account/profile'
import { Label } from '@/modules/ui/label'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { NormalInput } from '../input/normal'
import { PhoneNumberInput } from '../input/phoneNumber'
import { RadioInput } from '../input/radio'
import { DatePickerInput } from '../input/date'
import { secondsInAYear } from '@/lib/utils/calendar/date'


export const GeneralProfileForm = ({ form, readOnlyValues = [], hideForm = [] }: { form: UseFormReturn<z.infer<typeof profileSchema>>, readOnlyValues?: string[], hideForm?: string[] }) => {
    return (
        <div className='flex flex-col gap-5'>
            <NormalInput
                form={form}
                name='fullName'
                title="Full name"
                type='text'
                disabled={readOnlyValues.includes("fullName")}
                placeholder="Full name"
            />
            <div className='flex gap-2 flex-wrap'>

                {!hideForm.includes("email") && <div className='flex-1 min-w-[200px]'>
                    <NormalInput
                        form={form}
                        name='email'
                        title="Email"
                        type='email'
                        disabled={readOnlyValues.includes("email")}
                        placeholder="Email"
                    />
                </div>}


                {!hideForm.includes("phoneNumber") && <div className='flex-1 min-w-[200px]'>
                    <PhoneNumberInput
                        title={"Phone number"}
                        name="phoneNumber"
                        form={form}
                    />
                </div>
                }

            </div>


            {!hideForm.includes("dateOfBirth") &&
                <DatePickerInput
                    form={form}
                    name={`dateOfBirth`}
                    variant={"outline"}
                    placeholder='Date of birth'
                    maxDate={new Date(new Date().getTime() - secondsInAYear * 1000 * 14)}
                    title='Date of birth'

                />
            }

            {!hideForm.includes("gender") && <div className='flex-1 min-w-[200px]'>
                <RadioInput
                    form={form}
                    name='gender'
                    title="Gender"
                    values={[{
                        data: "Male",
                        value: "male"
                    }, {
                        data: "Female",
                        value: "female"
                    }]}
                    alignment='horizontal'
                />
            </div>}
        </div>
    )
}
