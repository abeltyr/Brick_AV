"use client"

import AddSVG from '@/assets/icons/add'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
    Form,
} from "@/modules/ui/form"
import { useToast } from '@/modules/ui/use-toast'
import { useState } from 'react'
import { useProducts } from '@/lib/context/product'
import { productSchema } from '@/lib/form/product'
import { useDrawerManager } from '@/lib/context/drawer/drawer'
import { DrawerSheetHeader } from '@/modules/common/components/drawer/header'
import { DrawerSheetFooter } from '@/modules/common/components/drawer/footer'
import { useCompany } from '@/lib/context/account'
import { GeneralProductForm } from '@/modules/common/components/form/generalProductForm'

export const AddProductSection = () => {
    const { setAddProductDrawer } = useDrawerManager();
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { toast } = useToast()

    const { currentCompany } = useCompany();
    const { createProduct } = useProducts();
    const form = useForm<z.infer<typeof productSchema>>({
        resolver: zodResolver(productSchema),
        defaultValues: {


        },
    })


    const onSubmit = async (values: z.infer<typeof productSchema>) => {
        console.log("isLoading")
        if (!isLoading) {
            setIsLoading(true)
            try {
                if (currentCompany) {
                    const product = await createProduct({
                        name: values.name,
                        description: values.description,
                        unit: values.unit,
                        unitPrice: values.unitPrice,
                        purchaseType: values.purchaseType,
                        type: values.type,
                        companyId: currentCompany.companyId,
                        chartOfAccountId: values.chartOfAccountId,

                    })
                    console.log("product", product)
                    setAddProductDrawer(false);
                    toast({
                        title: "Product Created",
                        description: (
                            <div className="mt-2 w-full rounded-md p-4 bg-green-300 text-foreground font-medium text-sm">
                                New Product has been added to your inventory data set.
                            </div>
                        ),
                    })
                }
            } catch (error: any) {
                console.log("message", error.message, error.message.includes('Unique constraint failed'))
                let message = {
                    title: "Chart of account creation failed",
                    description: "An error occurred. Please try again. If the issue persists, please contact us here."
                }


                if (error.message.includes('Unique constraint failed')) {
                    message = {
                        title: "Error: Chart of account with this Account Id Already exist",
                        description: "There's already a record with the same Account Id. Please check your Account Id input or check a your chart of account list."
                    }
                }


                toast({
                    title: message.title,
                    description: (
                        <div className="mt-2 w-full rounded-md bg-slate-950 p-4 text-red-200 font-medium text-sm">
                            {message.description}
                        </div>
                    ),
                });
            }
            setIsLoading(false)
        }
    }

    return (
        <div className='w-full h-full overflow-y-auto'>
            <DrawerSheetHeader title={"Add Purchase Items"} description='Provided the needed detail about the items' />
            <div className='h-28' />
            <Form {...form}>
                <div className='flex flex-col p-4 pb-20 flex-1 relative w-full h-full  gap-6'>
                    <GeneralProductForm form={form} />
                </div>
                <DrawerSheetFooter
                    isLoading={isLoading}
                    createSVG={<AddSVG />}
                    closeFunction={
                        (event: React.MouseEvent) => {
                            event.preventDefault();
                            setAddProductDrawer(false)
                        }
                    }
                    createFunction={
                        (event: React.MouseEvent) => {
                            event.preventDefault();
                            form.handleSubmit(onSubmit)()
                        }
                    }
                />
            </Form>
        </div>


    )
}
