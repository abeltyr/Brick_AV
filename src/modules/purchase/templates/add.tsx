"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch } from "react-hook-form"
import { z } from "zod"

import {
    Form,
} from "@/modules/ui/form"
import { useToast } from '@/modules/ui/use-toast'
import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/context/auth/user'
import { usePurchases } from '@/lib/context/purchase'
import Decimal from 'decimal.js'
import PurchaseDetailForm from '../components/add/purchaseDetailForm'
import PurchaseDeclarationAdjustmentForm from '../components/add/purchaseDeclarationAdjustmentForm'
import { AddPurchaseHeader } from '../components/add/header'
import PurchaseProductsForm from '../components/add/purchaseProductsForm'
import TotalPurchaseData from '../components/add/total'
import PurchaseVendorForm from '../components/add/purchaseVendorForm'
import { purchaseFormSchema } from '@/lib/form/purchase'
import { useCompany } from '@/lib/context/account'
import { VendorType } from '@/types/vendor'
import { totPurchaseSummation, UnregisteredPurchaseSummation, vatPurchaseSummation } from '@/lib/utils/purchase'


export const AddPurchaseSection = () => {



    const [vendor, setVendor] = useState<VendorType | null>(null)

    const [totalQuantity, setTotalQuantity] = useState<number>(0);
    const [taxableAmount, setTaxableAmount] = useState<Decimal>(new Decimal(0));
    const [nonTaxableAmount, setNonTaxableAmount] = useState<Decimal>(new Decimal(0));
    const [totalVat, setTotalVat] = useState<Decimal>(new Decimal(0));
    const [grossAmount, setGrossAmount] = useState<Decimal>(new Decimal(0));
    const [beforeTax, setBeforeTax] = useState<Decimal>(new Decimal(0));
    const [importedGoodSummaryAmount, setImportedGoodSummaryAmount] = useState<Decimal>(new Decimal(0));
    const [importedGoodWithholding, setImportedGoodWithholding] = useState<Decimal>(new Decimal(0));
    const [localGoodSummaryAmount, setLocalGoodSummaryAmount] = useState<Decimal>(new Decimal(0));
    const [localGoodWithholding, setLocalGoodWithholding] = useState<Decimal>(new Decimal(0));
    const [serviceSummaryAmount, setServiceSummaryAmount] = useState<Decimal>(new Decimal(0));
    const [serviceWithholding, setServiceWithholding] = useState<Decimal>(new Decimal(0));
    const [withholding, setWithholding] = useState<Decimal>(new Decimal(0));

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { toast } = useToast()

    const { currentCompany } = useCompany();
    const { createPurchase } = usePurchases();
    const form = useForm<z.infer<typeof purchaseFormSchema>>({
        resolver: zodResolver(purchaseFormSchema),
        defaultValues: {
        },
    })

    const watchedProducts = useWatch({
        control: form.control,
        name: "purchaseProducts",
    });

    useEffect(() => {
        if (vendor && vendor.business?.tinNumber) {
            if (form.getValues("taxType") === "VAT") {
                const {
                    summation
                } = vatPurchaseSummation({
                    purchaseProducts: watchedProducts,
                    generateBackendData: false,
                });
                const {
                    averagePrice,
                    grossAmount,
                    serviceSummaryAmount,
                    totalAmount,
                    totalQuantity,
                    nonTaxableAmount,
                    taxableAmount,
                    withholding,
                    serviceWithholding,
                    totalVat,
                    localGoodSummaryAmount,
                    importedGoodSummaryAmount,
                    localGoodWithholding,
                    importedGoodWithholding,
                } = summation

            } else {
                const {
                    summation
                } = totPurchaseSummation({
                    purchaseProducts: watchedProducts,
                    generateBackendData: false,
                });
                const {
                    averagePrice,
                    grossAmount,
                    serviceSummaryAmount,
                    totalAmount,
                    totalQuantity,
                    goodSummaryAmount,
                    goodWithholdingAmount,
                    serviceWithholdingAmount,
                    taxAmount,
                    withholdingAmount
                } = summation

            }

        } else {
            const {
                summation
            } = UnregisteredPurchaseSummation({
                purchaseProducts: watchedProducts,
                generateBackendData: false,
                hasWithholding: form.getValues("withholdingType") === "hasWithholding"
            });
            const {
                totalAmount,
                withholdingAmount,
                grossAmount,
                totalQuantity,
                averagePrice,
            } = summation
        }


        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [watchedProducts]);

    const onSubmit = async (values: z.infer<typeof purchaseFormSchema>) => {
        if (!isLoading) {
            setIsLoading(true)
            try {
                if (currentCompany) {
                    const purchase = await createPurchase({
                        companyId: currentCompany.companyId,
                        date: values.date,
                        taxType: values.taxType,
                        receiptNumber: values.receiptNumber,
                        mrcNumber: values.mrcNumber,
                        withholdingType: values.withholdingType,
                        withholdingNumber: values.withholdingNumber,
                        cashReceiptVoucher: values.cashReceiptVoucher,
                        vendorId: values.vendorId,
                        gebiwoch: values.gebiwoch,
                        purchaseProducts: watchedProducts,
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

    return (
        <div className='screen-parent'>
            <div className='w-full h-full overflow-y-auto  screen-padding  relative'>
                <Form {...form}>
                    <form className="space-y-2 w-full ">
                        <AddPurchaseHeader
                            actionFunction={() => {
                                form.handleSubmit(onSubmit)()
                            }}
                        />
                        <div className='h-[8vh]' />
                        <div className='flex  flex-wrap xl:flex-nowrap'>
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
                                    beforeTax={beforeTax}
                                />

                            </div>
                            <div className='w-full xl:flex-1 xl:min-w-[27%] flex flex-col gap-6 relative h-full'>
                                {/* <div className='relative xl:fixed xl:w-[25%] right-6 h-full' > */}
                                <div className='relative  h-full' >
                                    <TotalPurchaseData
                                        grossAmount={grossAmount.toNumber()}
                                        nonTaxableAmount={nonTaxableAmount.toNumber()}
                                        purchaseProducts={watchedProducts}
                                        taxableAmount={taxableAmount.toNumber()}
                                        totalVat={totalVat.toNumber()}
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
                        </div>
                    </form>
                </Form>
            </div>

        </div >
    )
}
