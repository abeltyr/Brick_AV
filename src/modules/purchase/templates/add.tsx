"use client"

import { z } from "zod"

import {
    Form,
} from "@/modules/ui/form"
import { useToast } from '@/modules/ui/use-toast'
import { AddPurchaseHeader } from '../components/add/header'
import PurchaseProductsForm from '../components/add/purchaseProductsForm'
import { purchaseSchema } from '@/lib/form/purchase'
import { useCompany, useProfile } from '@/lib/context/account'
import { AddPurchaseTopSection } from '../components/top'
import AddPurchaseSideSection from '../components/side'
import { useAddPurchases } from '@/lib/context/purchase/addPurchase'
import { useState } from 'react'
import PurchaseGebiwochReportForm from '../components/add/purchaseDeclarationAdjustmentForm'
import { Separator } from '@/modules/ui/separator'
import PurchaseDetailForm from '../components/add/purchaseDetailForm'


export const AddPurchaseSection = () => {


    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { toast } = useToast()

    const { currentCompany } = useCompany();
    const { profile } = useProfile();
    const { createPurchase, form } = useAddPurchases();



    const onSubmit = async (values: z.infer<typeof purchaseSchema>) => {
        console.log(values);
        if (!isLoading) {
            setIsLoading(true)
            try {
                if (currentCompany && profile) {
                    const purchase = await createPurchase({
                        companyId: currentCompany.companyId,
                        creatorId: profile.id,
                        purchaseInput: values
                    })
                    toast({
                        title: "Purchase Created",
                        description: (
                            <div className="mt-2 w-full rounded-md p-4 bg-green-300 text-foreground font-medium text-sm">
                                Your purchase has been added to your bill data set.
                            </div>
                        ),
                    })
                }
            } catch (e) {
                toast({
                    title: "Error Creating Purchase",
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

    if (!currentCompany) return <div></div>

    return (
        <div className='screen-parent'>
            <div className='w-full h-full overflow-y-auto  screen-padding  relative'>
                <Form {...form!}>
                    <AddPurchaseHeader
                        actionFunction={() => {
                            console.log(form?.formState);
                            form?.handleSubmit(onSubmit)()
                        }}
                    />
                    <div className='h-[8vh]' />
                    <AddPurchaseTopSection
                        companyId={currentCompany.companyId}
                        form={form!}
                    />

                    <div className='flex gap-6' >
                        <div className='flex-1 max-w-[402px]'>
                            <AddPurchaseSideSection />
                        </div>
                        <div className='flex-1 flex flex-col gap-8'>
                            <PurchaseDetailForm />
                            <PurchaseProductsForm />
                            <div className='px-6'>
                                <Separator className='my-6' />
                            </div>
                            <PurchaseGebiwochReportForm />
                        </div>

                    </div>
                </Form>
            </div>

        </div >
    )
}
