
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/modules/ui/select"
import { productInputType, productInputUnit, purchaseInputType } from '@/types/product'


export default function ProductTypeForm({ form }: { form: any }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <LanguageTranslator>
                        Product Type form
                    </LanguageTranslator>
                </CardTitle>
                <CardDescription>
                    <LanguageTranslator>
                        Provided the needed Product Detail
                    </LanguageTranslator>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-6">
                    <div className=" gap-3 flex justify-between">

                        <div className="flex-1">
                            <FormField
                                control={form.control}
                                name="purchaseType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='text-sm'>
                                            <LanguageTranslator>
                                                Purchase Type
                                            </LanguageTranslator></FormLabel>
                                        <FormControl>
                                            <Select
                                                {...field}
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                value={field.value}
                                            >
                                                <SelectTrigger id="PurchaseType" aria-label="Purchase Type">
                                                    <SelectValue placeholder="Purchase Type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {purchaseInputType.map((purchaseTypeData, index) => {
                                                        return (
                                                            <SelectItem value={purchaseTypeData.value} key={index}>
                                                                {purchaseTypeData.data}
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
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='text-sm'>
                                            <LanguageTranslator>
                                                Product Type
                                            </LanguageTranslator></FormLabel>
                                        <FormControl>
                                            <Select
                                                {...field}
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                value={field.value}
                                            >
                                                <SelectTrigger id="ProductType" aria-label="Product Type">
                                                    <SelectValue placeholder="Product Type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {productInputType.map((productInputData, index) => {
                                                        return (
                                                            <SelectItem value={productInputData} key={index}>
                                                                {productInputData}
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
                    </div>
                    <div className=" gap-3 flex justify-between">
                        <div className="flex-1">
                            <FormField
                                control={form.control}
                                name="unit"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='text-sm'>
                                            <LanguageTranslator>
                                                Product Unit
                                            </LanguageTranslator></FormLabel>
                                        <FormControl>
                                            <Select
                                                {...field}
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                value={field.value}
                                            >
                                                <SelectTrigger id="ProductUnit" aria-label="Product Unit">
                                                    <SelectValue placeholder="Product Unit" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {productInputUnit.map((productUnitData, index) => {
                                                        return (
                                                            <SelectItem value={productUnitData} key={index}>
                                                                {productUnitData}
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
                                name="unitPrice"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='text-sm'>
                                            <LanguageTranslator>
                                                Unit Price
                                            </LanguageTranslator>
                                        </FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="2000" {...field} className='px-4 py-3 focus:ring-0 focus:outline-none focus:border-0 ring-0 text-sm font-light placeholder:text-neutral-400' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
