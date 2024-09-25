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
import { useAuth } from '@/lib/context/auth/user'
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
            name: "Pen",
            purchaseType: "taxableLocalCapitalAssets",
            type: "Service",
            unit: "LIT",
            "unitPrice": 4200

        },
    })


    const onSubmit = async (values: z.infer<typeof productSchema>) => {
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
                        companyId: currentCompany.companyId
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
            } catch (e) {
                console.log(e)
                toast({
                    title: "Error Creating Product",
                    description: (
                        <div className="mt-2 w-full rounded-md bg-slate-950 p-4 text-red-300 font-medium text-sm">
                            An error occurred please try again. If the issue persists, please wait a moment before attempt again. If the issue persists, please contact us here.
                        </div>
                    ),
                })
            }
            setIsLoading(false)
        }
    }

    return (
        <div className='w-full h-full overflow-y-auto'>
            <DrawerSheetHeader title={"Add Purchase Items"} description='Provided the needed detail about the items' />
            <div className='h-20' />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 w-full">
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
                    />
                </form>
            </Form>
        </div>


    )
}
