
import { useDrawerManager } from '@/lib/context/drawer/drawer'
import { ChartOfAccountValueInput, purchaseSchema } from '@/lib/form/purchase'
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
import { productInputType, productInputUnit, purchaseInputType, purchaseTypeConvertor } from '@/lib/form/product/data'
import Decimal from 'decimal.js'
import { PlusCircle, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { z } from 'zod'
import { SelectInput } from '@/modules/common/components/input/select'
import { PriceInput } from '@/modules/common/components/input/price'
import { NormalInput } from '@/modules/common/components/input/normal'
import { ProductType } from '@/types/product'
import { ProductUnitType } from '@prisma/client'
import { ChartOfAccountInput } from '@/modules/common/components/input/coa'
import { ChartOfAccountType } from '@/types/purchase'
import { useCompany } from '@/lib/context/account'


export default function PurchaseProductsForm({ form }: { form: UseFormReturn<z.infer<typeof purchaseSchema>> }) {

    const { fields, append, remove, update } = useFieldArray({
        control: form.control,
        name: "purchaseProducts",
    });

    const { currentCompany } = useCompany()

    const { purchaseProductListingDrawer, setPurchaseProductListingDrawer } = useDrawerManager()

    const [error, setError] = useState(false)

    useEffect(() => {
        setError(form.formState.errors.purchaseProducts != undefined)

    }, [form.formState.errors.purchaseProducts])



    return (
        <div className={`w-full px-6 flex flex-col gap-8`}>
            <div>
                <p className='text-2xl font-bold'>Purchase Items</p>
                <p className='text-sm font-light text-[#71717A]'>
                    Add products to your purchase
                </p>
            </div>
            <div className='overflow-hidden'>
                {fields.length > 0 ? <Table className='overflow-hidden'>
                    <TableHeader>
                        <TableRow >
                            <TableHead className='text-sm text-[#A1A1A1] font-light'>Name</TableHead>
                            <TableHead className='text-sm text-[#A1A1A1] font-light'>Purchase Type</TableHead>
                            <TableHead className='text-sm text-[#A1A1A1] font-light'>Type</TableHead>
                            <TableHead className='text-sm text-[#A1A1A1] font-light'>COA</TableHead>
                            <TableHead className='text-sm text-[#A1A1A1] font-light'>Unit</TableHead>
                            <TableHead className='text-sm text-[#A1A1A1] font-light'>Quantity</TableHead>
                            <TableHead className='text-sm text-[#A1A1A1] font-light'>Unit Price</TableHead>
                            <TableHead className='text-sm text-[#A1A1A1] font-light'>Delete</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody >
                        {fields.map((field, index) => (
                            <TableRow key={field.id} >
                                <TableCell className='p-1 w-[100px]'>
                                    <NormalInput
                                        form={form}
                                        name={`purchaseProducts.${index}.name`}
                                        type='text'
                                        disabled={true}
                                        placeholder=""
                                    />
                                </TableCell>
                                <TableCell className='p-1 pr-2 '>
                                    <SelectInput
                                        form={form}
                                        name={`purchaseProducts.${index}.purchaseType`}
                                        selectTitle={{
                                            name: "Purchase Type",
                                            value: "PurchaseType"
                                        }}
                                        values={[...purchaseInputType]}
                                    />
                                </TableCell>
                                <TableCell className='p-0'>
                                    <SelectInput
                                        form={form}
                                        name={`purchaseProducts.${index}.type`}
                                        selectTitle={{
                                            name: "Choose Product Type",
                                            value: "ProductType"
                                        }}
                                        values={[...productInputType]}
                                    />
                                </TableCell>
                                {currentCompany && <TableCell className='p-0 w-28 overflow-hidden px-2 max-w-[20px]' >
                                    <ChartOfAccountInput
                                        companyId={currentCompany.companyId}
                                        className=''
                                        setChartOfAccount={(coa: ChartOfAccountType) => {
                                            form.setValue(`purchaseProducts.${index}.chartOfAccount`, {
                                                id: coa.id,
                                                amount: new Decimal(form.getValues(`purchaseProducts.${index}.unitPrice`)).mul(new Decimal(form.getValues(`purchaseProducts.${index}.quantity`))).toNumber(),
                                                balanceType: coa.creditBased ? "credit" : "debit",
                                                name: coa.name,
                                                code: coa.code
                                            });
                                            form.clearErrors()
                                        }}
                                        formData={form}
                                        showIcon={false}
                                        title="COA"
                                        showCode={true}
                                        variant={"outline"}
                                    />
                                </TableCell>}
                                <TableCell className='w-[80px] p-1'>
                                    <SelectInput
                                        form={form}
                                        name={`purchaseProducts.${index}.unit`}
                                        selectTitle={{
                                            name: "Choose Product Unit",
                                            value: "ProductUnit"
                                        }}
                                        values={[...productInputUnit]}
                                    />
                                </TableCell>
                                <TableCell className='w-[50px] p-1'>
                                    <PriceInput
                                        form={form}
                                        name={`purchaseProducts.${index}.quantity`}
                                        placeholder="1"
                                    />
                                </TableCell>
                                <TableCell className='w-[160px] p-1'>
                                    <PriceInput
                                        form={form}
                                        name={`purchaseProducts.${index}.unitPrice`}
                                        placeholder="Enter Balance Amount"
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
            </div>
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
                                        purchaseType: form.getValues("gebiwoch.purchaseType"),
                                        type: form.getValues("gebiwoch.productCategoryType"),
                                        unit: form.getValues("gebiwoch.unit"),
                                        description: form.getValues("gebiwoch.description")
                                    })
                                    if (!form.getValues("gebiwoch.purchaseType") || products.length === 1) {
                                        form.setValue("gebiwoch.purchaseType", products[0].purchaseType,)
                                        form.clearErrors("gebiwoch.purchaseType")
                                    }
                                    if (!form.getValues("gebiwoch.productCategoryType") || products.length === 1) {
                                        form.setValue("gebiwoch.productCategoryType", products[0].type)
                                        form.clearErrors("gebiwoch.productCategoryType")
                                    }
                                    if (!form.getValues("gebiwoch.unit") || products.length === 1)
                                        if (
                                            products &&
                                            products.length > 0 &&
                                            products[0] &&
                                            products[0].inventory &&
                                            products[0].inventory[0] &&
                                            products[0].inventory[0].productPrice &&
                                            products[0].inventory[0].productPrice[0].unit
                                        ) {

                                            form.setValue("gebiwoch.unit", products[0].inventory[0].productPrice[0].unit)
                                            form.clearErrors("gebiwoch.unit")
                                        }
                                    if (!form.getValues("gebiwoch.description") || products.length === 1) {
                                        form.setValue("gebiwoch.description", products[0].name)
                                        form.clearErrors("gebiwoch.description")
                                    }
                                }

                                products.map((product, index) => {
                                    let indexData = watchedProducts.findIndex((watchedProduct) => watchedProduct.productId === product.id)

                                    let unit: ProductUnitType = "PC";
                                    let unitPrice = 0;
                                    let inventoryId = ""
                                    let chartOfAccount: z.infer<typeof ChartOfAccountValueInput> | undefined = undefined;

                                    console.log("product.inventory[0].productPrice)", product)
                                    if (product.inventory && product.inventory.length > 0) {
                                        inventoryId = product.inventory[0].id;

                                        if (product.inventory[0].productPrice) {
                                            unit = product.inventory[0].productPrice[0].unit;
                                            unitPrice = new Decimal(product.inventory[0].productPrice[0].unitPrice).toNumber();
                                        }
                                        if (product.inventory[0].chartOfAccount) {
                                            chartOfAccount = {
                                                id: product.inventory[0].chartOfAccount.id,
                                                balanceType: product.inventory[0].chartOfAccount.creditBased ? "credit" : "debit",
                                                name: product.inventory[0].chartOfAccount.name,
                                                code: product.inventory[0].chartOfAccount.code,
                                                amount: new Decimal(unitPrice).mul(new Decimal(indexData === -1 ? 1 : watchedProducts[indexData].quantity + 1)).toNumber(),
                                            }
                                        }
                                    }
                                    const valueData = {
                                        productId: product.id,
                                        name: product.name,
                                        purchaseType: product.purchaseType,
                                        type: product.type,
                                        unit,
                                        unitPrice,
                                        initialProductPriceUnit: unit,
                                        initialProductPriceUnitPrice: unitPrice,
                                        productCode: product.productCode,
                                        inventoryId,
                                        chartOfAccount
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
        </div>

    )
}
