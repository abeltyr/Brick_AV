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
import { zProductInputType, zProductInputUnit, zPurchaseInputType } from '@/types/product'
import PurchaseDetailForm from '../components/add/purchaseDetailForm'
import PurchaseDeclarationAdjustmentForm from '../components/add/purchaseDeclarationAdjustmentForm'
import { AddPurchaseHeader } from '../components/add/header'
import PurchaseProductsForm from '../components/add/purchaseProductsForm'
import TotalPurchaseData from '../components/add/total'
import PurchaseVendorForm from '../components/add/purchaseVendorForm'

// import PurchaseTypeForm from '../components/add/purchaseTypeForm'
// import PurchaseDetailForm from '../components/add/purchaseDetailForm'



const formSchema = z.object({
    vendorId: z.string(),
    date: z.date(),
    invoiceNumber: z.string(),
    MRCNumber: z.string().optional(),
    VatReceiptNumber: z.string().optional(),
    purchaseType: zPurchaseInputType,
    type: zProductInputType,
    unit: zProductInputUnit,
    description: z.string(),
    purchaseProducts: z.array(z.object({
        productId: z.string(),
        name: z.string(),
        purchaseType: zPurchaseInputType,
        type: zProductInputType,
        unit: zProductInputUnit,
        unitPrice: z.instanceof(Decimal),
        quantity: z.number(),
    })),
})





export const AddPurchaseSection = () => {

    const [totalQuantity, setTotalQuantity] = useState<number>(0);
    const [taxableAmount, setTaxableAmount] = useState<Decimal>(new Decimal(0));
    const [nonTaxableAmount, setNonTaxableAmount] = useState<Decimal>(new Decimal(0));
    const [totalVat, setTotalVat] = useState<Decimal>(new Decimal(0));
    const [grossAmount, setGrossAmount] = useState<Decimal>(new Decimal(0));
    const [beforeTax, setBeforeTax] = useState<Decimal>(new Decimal(0));

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { toast } = useToast()

    const { currentCompany } = useAuth();
    const { createPurchase } = usePurchases();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: "Pola",
            MRCNumber: "MR21092190",
            VatReceiptNumber: "FC0019210",
            date: new Date(),
            invoiceNumber: "00001",
            purchaseProducts
                : [{
                    name: "Pen",
                    productId: "0ad5577b-6941-4490-9555-548b0a133e80",
                    purchaseType:
                        "taxableLocalCapitalAssets",
                    type: "Good",
                    unit: "PC",
                    quantity: 9,
                    unitPrice: new Decimal(4000)
                }],
            purchaseType: "taxableLocalCapitalAssets",
            type: "Good",
            unit: "PC",
            vendorId: "005a59a1-0e71-4b33-a2a0-c5118e802aa3"
        },
    })

    const watchedProducts = useWatch({
        control: form.control,
        name: "purchaseProducts",
    });

    useEffect(() => {
        const VAT_RATE = new Decimal('0.15'); // 15% VAT rate

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
        let newProductGood = 0;
        let newProductService = 0;
        let newUnits: Record<string, number> = {};


        if (watchedProducts) {
            watchedProducts.forEach((product, index) => {
                const totalValue = new Decimal(product.unitPrice || 0).times(product.quantity || 0);
                const vat = totalValue.times(VAT_RATE);

                switch (product.purchaseType) {
                    case "taxableLocalCapitalAssets":
                        newLocalPurchaseCapitalAssets = newLocalPurchaseCapitalAssets.plus(totalValue);
                        newVatOnLocalPurchaseCapitalAssets = newVatOnLocalPurchaseCapitalAssets.plus(vat);
                        break;
                    case "taxableImportedCapitalAssets":
                        newImportedCapitalAssets = newImportedCapitalAssets.plus(totalValue);
                        newVatOnImportedCapitalAssets = newVatOnImportedCapitalAssets.plus(vat);
                        break;
                    case "taxableLocalInputs":
                        newLocalPurchaseInputs = newLocalPurchaseInputs.plus(totalValue);
                        newVatOnLocalPurchaseInputs = newVatOnLocalPurchaseInputs.plus(vat);
                        break;
                    case "taxableImportedInputs":
                        newImportedInputs = newImportedInputs.plus(totalValue);
                        newVatOnImportedInputs = newVatOnImportedInputs.plus(vat);
                        break;
                    case "taxableGeneralExpenseInputs":
                        newGeneralExpenseInputs = newGeneralExpenseInputs.plus(totalValue);
                        newVatOnGeneralExpenseInputs = newVatOnGeneralExpenseInputs.plus(vat);
                        break;
                    case "taxExemptedPurchase":
                        newPurchaseWithNoVat = newPurchaseWithNoVat.plus(totalValue);
                        break;
                }
                newTotalQuantity += product.quantity;
                newProductGood += product.type === "Good" ? 1 : 0;
                newProductService += product.type === "Service" ? 1 : 0;
                newUnits[product.unit] = (newUnits[product.unit] || 0) + 1;
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
            // Update all state values
            setTaxableAmount(newTaxableAmount);
            setNonTaxableAmount(newNonTaxableAmount);
            setTotalVat(newTotalVat);
            setGrossAmount(newGrossAmount);

            if (watchedProducts.length === 1) {
                setTotalQuantity(watchedProducts[0].quantity)
                setBeforeTax(watchedProducts[0].unitPrice)
            } else {
                setTotalQuantity(1)
                setBeforeTax(beforeTaxData)
            }
        }
        // You can add more state updates here for totalQuantity, productGood, productService, and units if needed

    }, [watchedProducts]);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values, "values")
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
                    console.log(purchase)
                    /// TODO:Close the side bar
                    // SheetPrimitive.Close;
                }
            } catch (e) {
                console.log("errro", e)
                toast({
                    title: "Error Creating Purchase",
                    description: (
                        <div className="mt-2 w-full rounded-md bg-slate-950 p-4 text-red-300 font-medium text-sm">
                            An error occurred during the creating purchase process. Please try again. If the issue persists, please contact us here.
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
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 w-full ">
                        <AddPurchaseHeader />
                        <div className='h-[8vh]' />
                        <div className='flex gap-6 flex-wrap xl:flex-nowrap'>
                            <div className='w-full   xl:w-[75%]  flex-1 flex flex-col gap-6 pb-20 '>
                                <PurchaseVendorForm form={form} />
                                <PurchaseDetailForm form={form} />
                                <PurchaseProductsForm form={form} />
                                <PurchaseDeclarationAdjustmentForm
                                    form={form}
                                    totalQuantity={totalQuantity}
                                    beforeTax={beforeTax}
                                />

                            </div>
                            <div className='w-full xl:w-[25%]  flex flex-col gap-6 relative h-full'>
                                <div className='relative xl:fixed xl:w-[25%] right-6' >
                                    <TotalPurchaseData
                                        grossAmount={grossAmount}
                                        nonTaxableAmount={nonTaxableAmount}
                                        purchaseProducts={watchedProducts}
                                        taxableAmount={taxableAmount}
                                        totalVat={totalVat}
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
