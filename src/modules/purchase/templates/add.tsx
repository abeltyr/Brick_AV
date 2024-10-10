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
    const { createPurchase, form, vendor, chartOfAccount, withholding, receiptType } = useAddPurchases();



    const onSubmit = async (values: z.infer<typeof purchaseSchema>) => {


        let error = false;
        if (vendor && vendor.taxType === "VAT" && (!form!.getValues("vatChartOfAccountId") || form!.getValues("vatChartOfAccountId") === "" || !chartOfAccount.vatAccount)) {
            form?.setError("vatChartOfAccountId", {
                message: "Vat Payment COA Required"
            })
            error = true;
        }

        if (
            vendor &&
            vendor.taxType != "NONE" &&
            receiptType === "Machine" &&
            (!form!.getValues("mrcNumber") || form!.getValues("mrcNumber") === "")) {

            form?.setError("mrcNumber", {
                message: "MRC Number Is Required"
            })
            error = true;
        }

        if (
            vendor &&
            vendor.taxType != "NONE" &&
            receiptType === "Machine" &&
            form!.getValues("receiptNumber").length != 8) {
            form?.setError("receiptNumber", {
                message: "Receipt Number length should be 8 digits"
            })
            error = true;
        }


        if (withholding.greaterThan(0)) {
            if ((!form!.getValues("withholdingChartOfAccountId") || form!.getValues("withholdingChartOfAccountId") === "" || !chartOfAccount.withHolding)) {
                form?.setError("withholdingChartOfAccountId", {
                    message: "Withholding COA Required"
                })
                error = true;
            }
            if (!form!.getValues("withholdingNumber") || form!.getValues("withholdingNumber") === "") {
                form?.setError("withholdingNumber", {
                    message: "Withholding Number is Required"
                })
                error = true;
            }
        }

        console.log("form?.formState.errors", form?.formState.errors)
        if (error || (form?.formState.errors &&
            form?.formState.errors.date &&
            form?.formState.errors.date.message === "Out of account period range")) return


        form?.clearErrors()

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
            } catch (error: any) {
                console.log("message", error.message, error.message.includes('Unique constraint failed'))
                let message = {
                    title: "Error Recording the purchase failed",
                    description: "An error occurred. Please try again. If the issue persists, please contact us here."
                }


                if (error.message.includes('Unique constraint failed')) {
                    // if (error.message.includes("vendorTin`,`receiptNumber`"))
                    message = {
                        title: "Receipt number already exist",
                        description: "A purchase with the given receipt number for this vendor already exists"
                    }
                    form?.setError("receiptNumber", {
                        message: "Receipt number already exist",
                    })
                }

                if (error.message.includes('Account Period is not setup right')) {
                    // if (error.message.includes("vendorTin`,`receiptNumber`"))
                    message = {
                        title: "Account Period Issues",
                        description: "The date you have selected is out of the current fiscal year"
                    }
                    form?.setError("date", {
                        message: "Out of fiscal year range",
                    })
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
                        isLoading={isLoading}
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
                            <div className='px-6'>
                                <Separator className='my-6' />
                            </div>
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
