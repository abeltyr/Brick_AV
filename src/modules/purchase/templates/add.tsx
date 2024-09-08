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


export const AddPurchaseSection = () => {

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

    const { currentCompany } = useAuth();
    const { createPurchase } = usePurchases();
    const form = useForm<z.infer<typeof purchaseFormSchema>>({
        resolver: zodResolver(purchaseFormSchema),
        defaultValues: {
            MRCNumber: "MR21092190",
            VatReceiptNumber: "FC0019210",
            date: new Date(),
            invoiceNumber: "00001",
            withholdingNumber: "00001",
            purchaseProducts: [],
        },
    })

    const watchedProducts = useWatch({
        control: form.control,
        name: "purchaseProducts",
    });

    useEffect(() => {
        const VAT_RATE = new Decimal('0.15'); // 15% VAT rate
        const importedWithholdingRate = new Decimal('0.03'); // 3% Withholding rate
        const localWithholdingRate = new Decimal('0.02'); // 2% Withholding rate


        let newLocalGoodSummaryAmount = new Decimal(0);
        let newImportedGoodSummaryAmount = new Decimal(0);
        let newServiceSummaryAmount = new Decimal(0);
        let newLocalPurchaseCapitalAssets = new Decimal(0);
        let newVatOnLocalPurchaseCapitalAssets = new Decimal(0);
        let newImportedCapitalAssets = new Decimal(0);
        let newVatOnImportedCapitalAssets = new Decimal(0);
        let newLocalPurchaseInputs = new Decimal(0);
        let newVatOnLocalPurchaseInputs = new Decimal(0);
        let newImportedInputs = new Decimal(0);
        let newVatOnImportedInputs = new Decimal(0);
        let newGeneralExpenseInputs = new Decimal(0);
        let newVatOnGeneralExpenseInputs = new Decimal(0);
        let newPurchaseWithNoVat = new Decimal(0);
        let newTotalQuantity = 0;


        if (watchedProducts) {
            watchedProducts.forEach((product, index) => {
                const totalValue = new Decimal(product.unitPrice || 0).times(product.quantity || 0);
                const vat = totalValue.times(VAT_RATE);


                if (product.type === "Service")
                    newServiceSummaryAmount = newServiceSummaryAmount.plus(totalValue)

                switch (product.purchaseType) {
                    case "taxableLocalCapitalAssets":
                        newLocalPurchaseCapitalAssets = newLocalPurchaseCapitalAssets.plus(totalValue);
                        newVatOnLocalPurchaseCapitalAssets = newVatOnLocalPurchaseCapitalAssets.plus(vat);
                        if (product.type === "Good") {
                            newLocalGoodSummaryAmount = newLocalGoodSummaryAmount.plus(totalValue)
                        }
                        break;
                    case "taxableImportedCapitalAssets":
                        newImportedCapitalAssets = newImportedCapitalAssets.plus(totalValue);
                        newVatOnImportedCapitalAssets = newVatOnImportedCapitalAssets.plus(vat);
                        if (product.type === "Good") {
                            newImportedGoodSummaryAmount = newImportedGoodSummaryAmount.plus(totalValue)
                        }
                        break;
                    case "taxableLocalInputs":
                        newLocalPurchaseInputs = newLocalPurchaseInputs.plus(totalValue);
                        newVatOnLocalPurchaseInputs = newVatOnLocalPurchaseInputs.plus(vat);
                        if (product.type === "Good") {
                            newLocalGoodSummaryAmount = newLocalGoodSummaryAmount.plus(totalValue)
                        }
                        break;
                    case "taxableImportedInputs":
                        newImportedInputs = newImportedInputs.plus(totalValue);
                        newVatOnImportedInputs = newVatOnImportedInputs.plus(vat);
                        if (product.type === "Good") {
                            newImportedGoodSummaryAmount = newImportedGoodSummaryAmount.plus(totalValue)
                        }
                        break;
                    case "taxableGeneralExpenseInputs":
                        newGeneralExpenseInputs = newGeneralExpenseInputs.plus(totalValue);
                        newVatOnGeneralExpenseInputs = newVatOnGeneralExpenseInputs.plus(vat);
                        if (product.type === "Good") {
                            newLocalGoodSummaryAmount = newLocalGoodSummaryAmount.plus(totalValue)
                        }
                        break;
                    case "taxExemptedPurchase":
                        newPurchaseWithNoVat = newPurchaseWithNoVat.plus(totalValue);
                        if (product.type === "Good") {
                            newLocalGoodSummaryAmount = newLocalGoodSummaryAmount.plus(totalValue)
                        }
                        break;
                }
                newTotalQuantity += product.quantity;
            });

            const newTotalCapitalAssets = newLocalPurchaseCapitalAssets.plus(newImportedCapitalAssets);
            const newVatOnTotalAssets = newVatOnLocalPurchaseCapitalAssets.plus(newVatOnImportedCapitalAssets);
            const newTotalNonCapitalInputs = newLocalPurchaseInputs.plus(newImportedInputs).plus(newGeneralExpenseInputs);
            const newVatOnTotalInputs = newVatOnLocalPurchaseInputs.plus(newVatOnImportedInputs).plus(newVatOnGeneralExpenseInputs);
            const newTaxableAmount = newTotalCapitalAssets.plus(newTotalNonCapitalInputs);
            const newNonTaxableAmount = newPurchaseWithNoVat;
            const newTotalVat = newVatOnTotalAssets.plus(newVatOnTotalInputs);
            const newGrossAmount = newTaxableAmount.plus(newNonTaxableAmount).plus(newTotalVat);

            const beforeTaxData = newTaxableAmount.plus(newNonTaxableAmount)



            let newImportedGoodWithholding = new Decimal(0);
            let newLocalGoodWithholding = new Decimal(0);
            let newServiceWithholding = new Decimal(0);

            if (newLocalGoodSummaryAmount.greaterThan(10000)) {
                newLocalGoodWithholding = newLocalGoodSummaryAmount.times(localWithholdingRate);
            }

            if (newImportedGoodSummaryAmount.greaterThan(10000)) {
                newImportedGoodWithholding = newImportedGoodSummaryAmount.times(importedWithholdingRate);
            }

            if (newServiceSummaryAmount.greaterThan(3000)) {
                newServiceWithholding = newServiceSummaryAmount.times(localWithholdingRate);
            }



            const withholding = newServiceWithholding.plus(newLocalGoodWithholding).plus(newImportedGoodWithholding)
            setServiceWithholding(newServiceWithholding)
            setLocalGoodWithholding(newLocalGoodWithholding)
            setImportedGoodWithholding(newImportedGoodWithholding)
            setWithholding(withholding)

            setLocalGoodSummaryAmount(newLocalGoodSummaryAmount)
            setImportedGoodSummaryAmount(newImportedGoodSummaryAmount)
            setServiceSummaryAmount(newServiceSummaryAmount)

            // Update all state values
            setTaxableAmount(newTaxableAmount);
            setNonTaxableAmount(newNonTaxableAmount);
            setTotalVat(newTotalVat);
            setGrossAmount(newGrossAmount.minus(withholding));


            if (watchedProducts.length === 1) {
                setTotalQuantity(watchedProducts[0].quantity)
                setBeforeTax(new Decimal(watchedProducts[0].unitPrice))
            } else {
                setTotalQuantity(1)
                setBeforeTax(beforeTaxData)
            }
        }

    }, [watchedProducts]);

    const onSubmit = async (values: z.infer<typeof purchaseFormSchema>) => {
        if (!isLoading) {
            setIsLoading(true)
            try {
                if (currentCompany) {
                    const purchase = await createPurchase({
                        companyId: currentCompany.companyId,
                        data: {
                            date: values.date,
                            invoiceNumber: values.invoiceNumber,
                            MRCNumber: values.MRCNumber,
                            productType: values.type,
                            purchaseProducts: values.purchaseProducts,
                            purchaseType: values.purchaseType,
                            unit: values.unit,
                            vendorId: values.vendorId,
                            description: values.description,
                        }
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
                                <PurchaseVendorForm form={form} />
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
