import React from 'react'
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/modules/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/modules/ui/select'
import { addressSchema } from '@/lib/form/account'
import { Input } from "@/modules/ui/input"
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { LanguageTranslator } from '@/modules/language/components'
import { Textarea } from '@/modules/ui/textarea'
import addisAbabaWoreda from "@assets/region/addis_ababa.json"
import { SelectInput } from '../input/select'
import { NormalInput } from '../input/normal'
import { NormalTextAreaInput } from '../input/textArea'


const regions = [
    { "value": "addis_ababa", "data": "Addis Ababa" },
    // { "value": "afar_region", "data": "Afar Region" },
    // { "value": "amhara_region", "data": "Amhara Region" },
    // { "value": "benishangul_gumuz_region", "data": "Benishangul-Gumuz Region" },
    // { "value": "central_ethiopia_region", "data": "Central Ethiopia Regional State" },
    // { "value": "dire_dawa", "data": "Dire Dawa (City)" },
    // { "value": "gambela_region", "data": "Gambela Region" },
    // { "value": "harari_region", "data": "Harari Region" },
    // { "value": "oromia_region", "data": "Oromia Region" },
    // { "value": "sidama_region", "data": "Sidama Region" },
    // { "value": "somali_region", "data": "Somali Region" },
    // { "value": "south_ethiopia_region", "data": "South Ethiopia Regional State" },
    // { "value": "south_west_ethiopia_peoples_region", "data": "South West Ethiopia Peoples' Region" },
    // { "value": "tigray_region", "data": "Tigray Region" }
];
export const GeneralAddressForm = ({ form, readOnlyValues = [] }: { form: UseFormReturn<z.infer<typeof addressSchema>>, readOnlyValues?: string[] }) => {
    return (
        <div className='flex flex-col gap-5'>
            <div className=" gap-3 flex justify-between">

                <div className="flex-1">
                    <SelectInput
                        form={form}
                        name='region'
                        title='Region'
                        selectTitle={{
                            name: "Select Region",
                            value: "Select_Region"
                        }}
                        values={[...regions]}
                    />
                </div>
                <div className="flex-1">
                    <NormalInput
                        form={form}
                        name='zone'
                        title="Zone"
                        type='text'
                        placeholder="Zone"
                    />
                </div>
            </div>
            <div className=" gap-3 flex justify-between">
                <div className="flex-1">
                    <SelectInput
                        form={form}
                        name='woreda'
                        title='Woreda'
                        selectTitle={{
                            name: "Select Woreda",
                            value: "Select_Woreda"
                        }}
                        values={[...addisAbabaWoreda]}
                    />
                </div>
                <div className="flex-1">
                    <NormalInput
                        form={form}
                        name='kebele'
                        title="Kebele"
                        type='text'
                        placeholder="Kebele"
                    />
                </div>
                <div className="flex-1">
                    <NormalInput
                        form={form}
                        name='houseNumber'
                        title="House Number"
                        type='text'
                        placeholder="House Number"
                    />
                </div>
            </div>
            <div className="gap-3">
                <NormalTextAreaInput
                    form={form}
                    name='description'
                    title="Description of the area"
                    placeholder="Description of the address area"
                />
            </div>

        </div>
    )
}
