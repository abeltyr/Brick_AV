"use client"

import { AddProductHeader } from '../components/add/header'
import { Button } from '@/modules/ui/button'
import AddSVG from '@/assets/icons/add'
import { LanguageTranslator } from '@/modules/language/components'
import LoadingSVG from '@/assets/icons/loading'
import ProfileForm from '../components/add/productTypeForm'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import * as SheetPrimitive from "@radix-ui/react-dialog"

import {
    Form,
} from "@/modules/ui/form"
import { useToast } from '@/modules/ui/use-toast'
import { useState } from 'react'
import { useAuth } from '@/lib/context/auth/user'
import { useProducts } from '@/lib/context/product'
import Decimal from 'decimal.js'
import ProductTypeForm from '../components/add/productTypeForm'
import ProductDetailForm from '../components/add/productDetailForm'


const zProductInputType = z.enum(['Good', 'Service']);
const zProductInputUnit = z.enum([
    'KG',
    'ML',
    'GM',
    'LIT',
    'MT',
    'PCS',
    'CT',
    'OTHER',
    'PC',
]);

const zPurchaseInputType = z.enum([
    'taxableLocalCapitalAssets',
    'taxableImportedCapitalAssets',
    'taxableLocalInputs',
    'taxableImportedInputs',
    'taxableGeneralExpenseInputs',
    'taxExemptedPurchase'
]);

const formSchema = z.object({
    purchaseType: zPurchaseInputType,
    type: zProductInputType,
    unit: zProductInputUnit,
    unitPrice: z.union([
        z.string().transform(x => x.replace(/[^0-9.-]+/g, '')),
        z.number(),
    ]),
    name: z.string().min(3, {
        message: "A valid name with at least three words is needed",
    }),
    description: z.string().optional(),
})




export const AddProductSection = () => {

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { toast } = useToast()

    const { currentCompany } = useAuth();
    const { createProduct } = useProducts();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "Pen",
            purchaseType: "taxableLocalCapitalAssets",
            type: "Service",
            unit: "LIT",
            "unitPrice": "4200",
        },
    })


    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (!isLoading) {
            setIsLoading(true)
            try {
                if (currentCompany) {
                    const product = await createProduct({
                        name: values.name,
                        description: values.description,
                        unit: values.unit,
                        unitPrice: new Decimal(values.unitPrice),
                        purchaseType: values.purchaseType,
                        type: values.type,
                        companyId: currentCompany.companyId
                    })
                    /// TODO:Close the side bar
                    // SheetPrimitive.Close;
                }
            } catch (e) {
                console.log(e)
                toast({
                    title: "Error Creating Product",
                    description: (
                        <div className="mt-2 w-full rounded-md bg-slate-950 p-4 text-red-300 font-medium text-sm">
                            An error occurred during the creating product process. Please try again. If the issue persists, please contact us here.
                        </div>
                    ),
                })
            }
            setIsLoading(false)
        }
    }

    return (
        <div className='w-full h-full overflow-y-auto'>
            <AddProductHeader />
            <div className='h-20' />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 w-full">
                    <div className='flex flex-col p-4 pb-20 flex-1 relative w-full h-full  gap-6'>
                        <ProductDetailForm form={form} />
                        <ProductTypeForm form={form} />
                    </div>
                    <div className='left-0 right-0 px-6 bottom-0 py-3 absolute flex justify-end gap-6 bg-background/90'>

                        <SheetPrimitive.Close className="rounded-full transition-colors text-foreground/70 duration-300 hover:text-foreground">
                            <Button className='flex gap-2 p-x4 py-2'
                                variant={"secondary"}
                            >
                                <AddSVG />
                                <LanguageTranslator>
                                    Cancel
                                </LanguageTranslator>
                            </Button>
                        </SheetPrimitive.Close>

                        <Button
                            disabled={isLoading}
                            className='flex gap-2 p-x4 py-2'
                            onClick={() => {

                            }}
                        >
                            {isLoading ? (
                                <div className='h-5 w-5 animate-spin'>
                                    <LoadingSVG />
                                </div>
                            ) : <AddSVG />}


                            {isLoading ? (
                                <LanguageTranslator>
                                    Creating
                                </LanguageTranslator>
                            ) : <LanguageTranslator>
                                Create
                            </LanguageTranslator>}


                        </Button>
                    </div>
                </form>
            </Form>
        </div>


    )
}
