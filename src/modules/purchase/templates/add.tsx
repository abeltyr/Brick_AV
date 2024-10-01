"use client"

import { z } from "zod"

import {
    Form,
} from "@/modules/ui/form"
import { useToast } from '@/modules/ui/use-toast'
import PurchaseDetailForm from '../components/add/purchaseDetailForm'
import { AddPurchaseHeader } from '../components/add/header'
import PurchaseProductsForm from '../components/add/purchaseProductsForm'
import { purchaseSchema } from '@/lib/form/purchase'
import { useCompany, useProfile } from '@/lib/context/account'
import { AddPurchaseTopSection } from '../components/top'
import AddPurchaseSideSection from '../components/side'
import { useAddPurchases } from '@/lib/context/purchase/addPurchase'
import { useState } from 'react'


export const AddPurchaseSection = () => {


    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { toast } = useToast()

    const { currentCompany } = useCompany();
    const { profile } = useProfile();
    const { createPurchase, form } = useAddPurchases();



    const onSubmit = async (values: z.infer<typeof purchaseSchema>) => {
        if (!isLoading) {
            setIsLoading(true)
            try {
                if (currentCompany && profile) {
                    const purchase = await createPurchase({
                        mrcNumber: values.mrcNumber,
                        companyId: currentCompany.companyId,
                        vendorId: values.vendorId,
                        date: values.date,
                        taxType: values.taxType,
                        receiptNumber: values.receiptNumber,
                        withholdingType: values.withholdingType,
                        withholdingNumber: values.withholdingNumber,
                        cashReceiptVoucher: values.cashReceiptVoucher,
                        chartOfAccount: values.chartOfAccount,
                        gebiwoch: values.gebiwoch,
                        purchaseProducts: values.purchaseProducts,
                        creatorId: profile.id,
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
                        <div className='flex-1'>
                            <PurchaseDetailForm form={form!} />
                            <PurchaseProductsForm form={form!} />
                        </div>

                    </div>

                    {/* <div className='flex  flex-wrap xl:flex-nowrap'>
                        <div className='w-full  xl:min-w-[73%] pr-2  flex-1 flex flex-col gap-6 pb-20 '>
                            <PurchaseVendorForm
                                form={form}
                                vendor={vendor}
                                setVendor={setVendor}
                            />
                            <PurchaseDetailForm form={form} />
                            <PurchaseProductsForm form={form} />
                            <PurchaseDeclarationAdjustmentForm
                                form={form}
                                totalQuantity={totalQuantity}
                                taxTotal={taxTotal}
                            />

                        </div>
                        <div className='w-full xl:flex-1 xl:min-w-[27%] flex flex-col gap-6 relative h-full'>
                            <div className='relative  h-full' >
                                <TotalPurchaseData
                                    grossAmount={grossAmount.toNumber()}
                                    nonTaxableAmount={nonTaxableAmount.toNumber()}
                                    purchaseProducts={watchedProducts}
                                    taxableAmount={taxableAmount.toNumber()}
                                    taxTotal={taxTotal.toNumber()}
                                    importedGoodSummaryAmount={importedGoodSummaryAmount.toNumber()}
                                    importedGoodWithholding={importedGoodWithholding.toNumber()}
                                    localGoodSummaryAmount={localGoodSummaryAmount.toNumber()}
                                    localGoodWithholding={localGoodWithholding.toNumber()}
                                    serviceSummaryAmount={serviceSummaryAmount.toNumber()}
                                    serviceWithholding={serviceWithholding.toNumber()}
                                    withholding={withholding.toNumber()}
                                />
                            </div>
                        </div>
                    </div> */}


                </Form>
            </div>

        </div >
    )
}
