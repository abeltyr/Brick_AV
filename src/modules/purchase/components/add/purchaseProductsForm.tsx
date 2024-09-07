
import { useDrawerManager } from '@/lib/context/drawer/drawer'
import { LanguageTranslator } from '@/modules/language/components'
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
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/modules/ui/form'
import { Input } from "@/modules/ui/input"
import { Label } from '@/modules/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/modules/ui/select"
import { Sheet, SheetContent, SheetTrigger } from '@/modules/ui/sheet'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/modules/ui/table'
import { productInputType, productInputUnit, ProductType, purchaseInputType } from '@/types/product'
import Decimal from 'decimal.js'
import { PlusCircle } from 'lucide-react'
import { useFieldArray, useForm, useWatch, } from 'react-hook-form';


export default function PurchaseProductsForm({ form }: { form: any }) {

    const { fields, append, remove, update } = useFieldArray({
        control: form.control,
        name: "purchaseProducts",
    });

    const { purchaseProductListingDrawer, setPurchaseProductListingDrawer } = useDrawerManager()

    const addProduct = () => {
        append({
            productId: '',
            name: '',
            purchaseType: 'taxableLocalInputs',
            type: 'Good',
            unit: 'PC',
            unitPrice: new Decimal(1000),
            quantity: 1,
            totalValue: new Decimal(1000),
        });
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Purchase Products</CardTitle>
                <CardDescription>
                    Add products to your purchase
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
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
                    <TableBody>
                        {fields.map((field, index) => (
                            <TableRow key={field.id} >

                                <TableCell className='p-1 w-[130px]'>
                                    <FormField
                                        control={form.control}
                                        name={`purchaseProducts.${index}.name`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input {...field} />
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
                                                        step="0.01"
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            field.onChange(value === "" ? "" : new Decimal(value));
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Button type="button" variant="ghost" onClick={() => remove(index)}>[]</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
            <CardFooter className="justify-between border-t p-4">
                <Sheet
                    modal={purchaseProductListingDrawer}
                    onOpenChange={setPurchaseProductListingDrawer}
                >
                    <SheetTrigger asChild>
                        <Button type="button" variant="outline" className="gap-1">
                            <PlusCircle className="h-3.5 w-3.5" />
                            Add Products
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="max-w-[400px] min-w-[60%] p-0 flex flex-col h-full ">
                        <SearchProductSection
                            updateProduct={(products: ProductType[]) => {
                                let watchedProducts = form.getValues("purchaseProducts")
                                console.log("watchedProducts", watchedProducts);
                                products.map((product, index) => {
                                    let indexData = -1
                                    watchedProducts.map((watchedProduct: any, newIndex: number) => {
                                        console.log(watchedProduct.productId === product.id, watchedProduct, product.id)
                                        if (watchedProduct.productId === product.id) {
                                            indexData = newIndex
                                        }
                                    })
                                    if (indexData === -1)
                                        append({
                                            productId: product.id,
                                            name: product.name,
                                            purchaseType: product.purchaseType,
                                            type: product.type,
                                            unit: product.ProductPrice?.unit,
                                            unitPrice: new Decimal(product.ProductPrice?.unitPrice ?? 0),
                                            quantity: 1,
                                        });
                                    else {
                                        update(indexData, {
                                            productId: product.id,
                                            name: product.name,
                                            purchaseType: product.purchaseType,
                                            type: product.type,
                                            unit: product.ProductPrice?.unit,
                                            unitPrice: new Decimal(product.ProductPrice?.unitPrice ?? 0),
                                            quantity: watchedProducts[indexData].quantity + 1,
                                        });
                                    }
                                })

                            }}
                        />
                    </SheetContent>
                </Sheet>
            </CardFooter>
        </Card>

    )
}
