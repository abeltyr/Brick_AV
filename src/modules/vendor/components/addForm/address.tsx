
import { LanguageTranslator } from '@/modules/language/components'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/modules/ui/card"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/modules/ui/form'
import { Input } from "@/modules/ui/input"
import { Textarea } from '@/modules/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/modules/ui/select"

const cities = [
    { "value": "addis_ababa", "data": "Addis Ababa" },
    { "value": "dire_dawa", "data": "Dire Dawa" },
    { "value": "mekelle", "data": "Mekelle" },
    { "value": "gondar", "data": "Gondar" },
    { "value": "adama", "data": "Adama" },
    { "value": "hawassa", "data": "Hawassa" },
    { "value": "bahir_dar", "data": "Bahir Dar" },
    { "value": "jimma", "data": "Jimma" },
    { "value": "harar", "data": "Harar" },
    { "value": "debre_birhan", "data": "Debre Birhan" },
    { "value": "dessie", "data": "Dessie" },
    { "value": "jijiga", "data": "Jijiga" },
    { "value": "shashamane", "data": "Shashamane" },
    { "value": "arba_minch", "data": "Arba Minch" },
    { "value": "debre_markos", "data": "Debre Markos" },
    { "value": "nekemte", "data": "Nekemte" },
    { "value": "asella", "data": "Asella" },
    { "value": "bishoftu", "data": "Bishoftu" },
    { "value": "dilla", "data": "Dilla" },
    { "value": "woldiya", "data": "Woldiya" },
    { "value": "sodo", "data": "Sodo" },
    { "value": "adigrat", "data": "Adigrat" },
    { "value": "hosaena", "data": "Hosaena" },
    { "value": "aksum", "data": "Aksum" },
    { "value": "ambo", "data": "Ambo" },
    { "value": "gambela", "data": "Gambela" },
    { "value": "mettu", "data": "Mettu" },
    { "value": "assosa", "data": "Assosa" },
    { "value": "goba", "data": "Goba" },
    { "value": "bedele", "data": "Bedele" },
    { "value": "fiche", "data": "Fiche" }
];

export default function AddressForm({ form }: { form: any }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <LanguageTranslator>
                        Vendor Address
                    </LanguageTranslator>
                </CardTitle>
                <CardDescription>
                    <LanguageTranslator>
                        Provided the needed Vendor Address, This is optional
                    </LanguageTranslator>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-6">
                    <div className=" gap-3 flex justify-between">

                        <div className="flex-1">
                            <FormField
                                control={form.control}
                                name="city"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='text-sm'>
                                            <LanguageTranslator>
                                                City
                                            </LanguageTranslator></FormLabel>
                                        <FormControl>
                                            <Select
                                                {...field}
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                value={field.value}
                                            >
                                                <SelectTrigger id="city" aria-label="Select City">
                                                    <SelectValue placeholder="Select City" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {cities.map((city, index) => {
                                                        return (
                                                            <SelectItem value={city.value} key={index}>
                                                                {city.data}
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
                                name="region"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='text-sm'>
                                            <LanguageTranslator>
                                                Region
                                            </LanguageTranslator></FormLabel>
                                        <FormControl>
                                            <Input type="text" placeholder="Kolfe Keranio" {...field} className='px-4 py-3 focus:ring-0 focus:outline-none focus:border-0 ring-0 text-sm font-light placeholder:text-neutral-400' />
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
                                            <Input type="text" placeholder="01" {...field} className='px-4 py-3 focus:ring-0 focus:outline-none focus:border-0 ring-0 text-sm font-light placeholder:text-neutral-400' />
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
                                            <Input type="text" placeholder="New or B-102" {...field} className='px-4 py-3 focus:ring-0 focus:outline-none focus:border-0 ring-0 text-sm font-light placeholder:text-neutral-400' />
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
            </CardContent>
        </Card>
    )
}
