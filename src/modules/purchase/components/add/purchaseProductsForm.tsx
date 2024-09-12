
import { useDrawerManager } from '@/lib/context/drawer/drawer'
import { purchaseFormSchema } from '@/lib/form/purchase'
import { SearchProductSection } from '@/modules/products/templates'
import { Button } from '@/modules/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/modules/ui/card"
import { FormControl, FormField, FormItem, FormMessage } from '@/modules/ui/form'
import { Input } from "@/modules/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/modules/ui/select"
import { Sheet, SheetContent, SheetTrigger } from '@/modules/ui/sheet'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/modules/ui/table'
import { productInputType, productInputUnit, ProductType, purchaseInputType, purchaseTypeConvertor } from '@/lib/form/product/data'
import Decimal from 'decimal.js'
import { PlusCircle, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { z } from 'zod'


export default function PurchaseProductsForm({ form }: { form: UseFormReturn<z.infer<typeof purchaseFormSchema>> }) {

    const { fields, append, remove, update } = useFieldArray({
        control: form.control,
        name: "purchaseProducts",
    });

    const { purchaseProductListingDrawer, setPurchaseProductListingDrawer } = useDrawerManager()

    const [error, setError] = useState(false)

    useEffect(() => {
        setError(form.formState.errors.purchaseProducts != undefined)

    }, [form.formState.errors.purchaseType])



    return (
        <Card className={`w-full ${form.formState.errors.purchaseProducts ? "border-[1px] border-red-400/50 " : ""}`}>
            <CardHeader>
                <CardTitle>Purchase Products</CardTitle>
                <CardDescription>
                    Add products to your purchase
                </CardDescription>
            </CardHeader>
            <CardContent className='overflow-hidden'>
                {fields.length > 0 ? <Table className='overflow-hidden'>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Purchase Type</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Unit</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Unit Price</TableHead>
                            <TableHead>Remove</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody >
                        {fields.map((field, index) => (
                            <TableRow key={field.id} >
                                <TableCell className='p-1 w-[130px]'>
                                    <FormField
                                        control={form.control}
                                        name={`purchaseProducts.${index}.name`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input {...field} readOnly />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </TableCell>
                                <TableCell className='p-1 pr-2 '>
                                    <FormField
                                        control={form.control}
                                        name={`purchaseProducts.${index}.purchaseType`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Select
                                                        {...field}
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                        value={field.value}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select purchase type" />
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
                                </TableCell>
                                <TableCell className='p-0'>
                                    <FormField
                                        control={form.control}
                                        name={`purchaseProducts.${index}.type`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Select
                                                        {...field}
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                        value={field.value}
                                                    >
                                                        <SelectTrigger className='w-[100px]' id="ProductType" aria-label="Product Type">
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
                                </TableCell>
                                <TableCell className='p-0'>
                                    <FormField
                                        control={form.control}
                                        name={`purchaseProducts.${index}.unit`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Select
                                                        {...field}
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                        value={field.value}
                                                    >
                                                        <SelectTrigger className='w-[70px]' id="PurchaseUnit" aria-label="Purchase Unit">
                                                            <SelectValue placeholder="Purchase Unit" />
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
                                </TableCell>
                                <TableCell className='w-[110px] p-1'>
                                    <FormField
                                        control={form.control}
                                        name={`purchaseProducts.${index}.quantity`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type="number"
                                                        step="1"
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            field.onChange(value === "" ? undefined : Number(value));
                                                        }} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </TableCell>
                                <TableCell className='w-[160px] p-1'>
                                    <FormField
                                        control={form.control}
                                        name={`purchaseProducts.${index}.unitPrice`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type="number"
                                                        step="1"
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            field.onChange(value === "" ? undefined : Number(value));
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </TableCell>
                                <TableCell className='text-center'>
                                    <Button
                                        variant="outline" onClick={() => remove(index)} className='p-3 hover:border-red-900 hover:text-red-900 duration-300 '>
                                        <Trash2 className='w-4 h-4' />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table> :
                    <div className='w-full  flex flex-col item-center justify-center py-4 '>
                        <p className='text-center'>
                            No Product has been selected yet
                        </p>
                        {form.formState.errors.purchaseProducts && <p className='text-red-600 mt-4 text-left'>
                            {form.formState.errors.purchaseProducts.message}
                        </p>}
                    </div>
                }
            </CardContent>
            <CardFooter className="justify-between border-t p-4">
                <Sheet
                    open={purchaseProductListingDrawer}
                    modal={purchaseProductListingDrawer}
                    onOpenChange={setPurchaseProductListingDrawer}
                >
                    <SheetTrigger asChild>
                        <Button type="button" variant="outline" className="gap-1">
                            <PlusCircle className="h-3.5 w-3.5" />
                            Add Products
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="max-w-[400px] min-w-[75%] p-0 flex flex-col h-full ">
                        <SearchProductSection
                            updateProduct={(products: ProductType[]) => {
                                let watchedProducts = form.getValues("purchaseProducts")


                                if (products.length > 0) {

                                    console.log({
                                        products,
                                        purchaseType: form.getValues("purchaseType"),
                                        type: form.getValues("type"),
                                        unit: form.getValues("unit"),
                                        description: form.getValues("description")
                                    })
                                    if (!form.getValues("purchaseType") || products.length === 1) {
                                        form.setValue("purchaseType", products[0].purchaseType,)
                                        form.clearErrors("purchaseType")
                                    }
                                    if (!form.getValues("type") || products.length === 1) {
                                        form.setValue("type", products[0].type)
                                        form.clearErrors("type")
                                    }
                                    if (!form.getValues("unit") || products.length === 1)
                                        if (products[0].ProductPrice) {
                                            form.setValue("unit", products[0].ProductPrice?.unit)
                                            form.clearErrors("unit")
                                        }
                                    if (!form.getValues("description") || products.length === 1) {
                                        form.setValue("description", products[0].name)
                                        form.clearErrors("description")
                                    }
                                }

                                products.map((product, index) => {
                                    let indexData = watchedProducts.findIndex((watchedProduct) => watchedProduct.productId === product.id)

                                    console.log("indexData", indexData)
                                    const valueData = {
                                        productId: product.id,
                                        name: product.name,
                                        purchaseType: product.purchaseType,
                                        type: product.type,
                                        unit: product.ProductPrice?.unit ?? "PC",
                                        unitPrice: new Decimal(product.ProductPrice?.unitPrice ?? 0).toNumber(),
                                        productCode: product.productCode
                                    };

                                    if (indexData === -1)
                                        append({
                                            ...valueData,
                                            quantity: 1,
                                        });
                                    else {
                                        update(indexData, {
                                            ...valueData,
                                            quantity: watchedProducts[indexData].quantity + 1,
                                        });
                                    }
                                })
                                console.log("update");

                            }}
                        />
                    </SheetContent>
                </Sheet>
            </CardFooter>
        </Card>

    )
}
