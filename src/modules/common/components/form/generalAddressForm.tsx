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


// const cities = [
//     { "value": "addis_ababa", "data": "Addis Ababa" },
//     { "value": "dire_dawa", "data": "Dire Dawa" },
//     { "value": "mekelle", "data": "Mekelle" },
//     { "value": "gondar", "data": "Gondar" },
//     { "value": "adama", "data": "Adama" },
//     { "value": "hawassa", "data": "Hawassa" },
//     { "value": "bahir_dar", "data": "Bahir Dar" },
//     { "value": "jimma", "data": "Jimma" },
//     { "value": "harar", "data": "Harar" },
//     { "value": "debre_birhan", "data": "Debre Birhan" },
//     { "value": "dessie", "data": "Dessie" },
//     { "value": "jijiga", "data": "Jijiga" },
//     { "value": "shashamane", "data": "Shashamane" },
//     { "value": "arba_minch", "data": "Arba Minch" },
//     { "value": "debre_markos", "data": "Debre Markos" },
//     { "value": "nekemte", "data": "Nekemte" },
//     { "value": "asella", "data": "Asella" },
//     { "value": "bishoftu", "data": "Bishoftu" },
//     { "value": "dilla", "data": "Dilla" },
//     { "value": "woldiya", "data": "Woldiya" },
//     { "value": "sodo", "data": "Sodo" },
//     { "value": "adigrat", "data": "Adigrat" },
//     { "value": "hosaena", "data": "Hosaena" },
//     { "value": "aksum", "data": "Aksum" },
//     { "value": "ambo", "data": "Ambo" },
//     { "value": "gambela", "data": "Gambela" },
//     { "value": "mettu", "data": "Mettu" },
//     { "value": "assosa", "data": "Assosa" },
//     { "value": "goba", "data": "Goba" },
//     { "value": "bedele", "data": "Bedele" },
//     { "value": "fiche", "data": "Fiche" }
// ];

const regions = [
    { "value": "addis_ababa", "data": "Addis Ababa (City)" },
    { "value": "afar_region", "data": "Afar Region" },
    { "value": "amhara_region", "data": "Amhara Region" },
    { "value": "benishangul_gumuz_region", "data": "Benishangul-Gumuz Region" },
    { "value": "central_ethiopia_region", "data": "Central Ethiopia Regional State" },
    { "value": "dire_dawa", "data": "Dire Dawa (City)" },
    { "value": "gambela_region", "data": "Gambela Region" },
    { "value": "harari_region", "data": "Harari Region" },
    { "value": "oromia_region", "data": "Oromia Region" },
    { "value": "sidama_region", "data": "Sidama Region" },
    { "value": "somali_region", "data": "Somali Region" },
    { "value": "south_ethiopia_region", "data": "South Ethiopia Regional State" },
    { "value": "south_west_ethiopia_peoples_region", "data": "South West Ethiopia Peoples' Region" },
    { "value": "tigray_region", "data": "Tigray Region" }
];
export const GeneralAddressForm = ({ form }: { form: UseFormReturn<z.infer<typeof addressSchema>> }) => {
    return (
        <div className='flex flex-col gap-5'>
            <div className=" gap-3 flex justify-between">

                <div className="flex-1">
                    <FormField
                        control={form.control}
                        name="region"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='text-sm'>
                                    <LanguageTranslator>
                                        Region
                                    </LanguageTranslator></FormLabel>
                                <FormControl>
                                    <Select
                                        {...field}
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        value={field.value}
                                    >
                                        <SelectTrigger id="region" aria-label="Select Region">
                                            <SelectValue placeholder="Select Region" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {regions.map((region, index) => {
                                                return (
                                                    <SelectItem value={region.value} key={index}>
                                                        {region.data}
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
                </div>
                <div className="flex-1">
                    <FormField
                        control={form.control}
                        name="zone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='text-sm'>
                                    <LanguageTranslator>
                                        Zone
                                    </LanguageTranslator></FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="Kolfe Keranio" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>
            <div className=" gap-3 flex justify-between">
                <div className="flex-1">
                    <FormField
                        control={form.control}
                        name="woreda"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='text-sm'>
                                    <LanguageTranslator>
                                        Woreda
                                    </LanguageTranslator></FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="01" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="flex-1">
                    <FormField
                        control={form.control}
                        name="kebele"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='text-sm'>
                                    <LanguageTranslator>
                                        Kebele
                                    </LanguageTranslator></FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="01" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="flex-1">
                    <FormField
                        control={form.control}
                        name="houseNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='text-sm'>
                                    <LanguageTranslator>
                                        House Number
                                    </LanguageTranslator></FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="New or B-102" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>
            <div className="gap-3">
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-sm'>
                                <LanguageTranslator>
                                    Description of the area
                                </LanguageTranslator></FormLabel>
                            <FormControl>
                                <Textarea
                                    {...field}
                                    id="description"
                                    placeholder="Description of the address area"
                                    className="min-h-32"
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

            </div>

        </div>
    )
}
