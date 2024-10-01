'use client'

import { createPurchaseAction } from '@/lib/data/purchase/create';
import { purchaseProducts, purchaseSchema } from '@/lib/form/purchase';
import { ChartOfAccountType, PurchaseInputType } from '@/types/purchase';
import React, { useContext, useEffect, useState } from "react";
import { useForm, UseFormReturn, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod"
import { VendorType } from '@/types/vendor';
import Decimal from 'decimal.js';
import { totPurchaseSummation, UnregisteredPurchaseSummation, vatPurchaseSummation } from '@/lib/utils/purchase';


type ChartOfAccountUpdatesType = {
    id: string,
    name: string,
    code: string,
    amount: number,
    quantity: number
}

type ChartOfAccountListType = {
    paymentAccount: ChartOfAccountType | null;
    vatAccount: ChartOfAccountUpdatesType | null;
    withHolding: ChartOfAccountUpdatesType | null;
    productsChartAccount: {
        [id: string]: ChartOfAccountUpdatesType;
    }
};

type purchaseProductsType = z.infer<typeof purchaseProducts>
const initialValues: {
    createPurchase: ({ }: PurchaseInputType) => void;
    form: UseFormReturn<z.infer<typeof purchaseSchema>> | null
    setVendor: React.Dispatch<React.SetStateAction<VendorType | null>>
    vendor: VendorType | null
    totalQuantity: number;
    taxableAmount: Decimal;
    nonTaxableAmount: Decimal;
    taxTotal: Decimal;
    grossAmount: Decimal;
    totalAmount: Decimal;
    importedGoodSummaryAmount: Decimal;
    importedGoodWithholding: Decimal;
    localGoodSummaryAmount: Decimal;
    localGoodWithholding: Decimal;
    serviceSummaryAmount: Decimal;
    serviceWithholding: Decimal;
    withholding: Decimal;
    purchaseProducts: purchaseProductsType[] | null
    chartOfAccount: ChartOfAccountListType
    setChartOfAccount: React.Dispatch<React.SetStateAction<ChartOfAccountListType>>
} = {
    createPurchase: ({ }: PurchaseInputType) => { },
    form: null,
    setVendor: () => { },
    vendor: null,
    totalQuantity: 0,
    taxableAmount: new Decimal(0),
    nonTaxableAmount: new Decimal(0),
    taxTotal: new Decimal(0),
    grossAmount: new Decimal(0),
    totalAmount: new Decimal(0),
    importedGoodSummaryAmount: new Decimal(0),
    importedGoodWithholding: new Decimal(0),
    localGoodSummaryAmount: new Decimal(0),
    localGoodWithholding: new Decimal(0),
    serviceSummaryAmount: new Decimal(0),
    serviceWithholding: new Decimal(0),
    withholding: new Decimal(0),
    purchaseProducts: null,
    chartOfAccount: {
        paymentAccount: null,
        vatAccount: null,
        withHolding: null,
        productsChartAccount: {}
    },
    setChartOfAccount: () => { }
};

type Props = {
    children?: React.ReactNode;
};

const AddPurchasesContext = React.createContext(initialValues);

const useAddPurchases = () => useContext(AddPurchasesContext);

const AddPurchasesProvider: React.FC<Props> = ({ children }) => {

    const [vendor, setVendor] = useState<VendorType | null>(null)


    const [totalQuantity, setTotalQuantity] = useState<number>(0);
    const [chartOfAccount, setChartOfAccount] = useState<ChartOfAccountListType>({
        paymentAccount: null,
        vatAccount: null,
        withHolding: null,
        productsChartAccount: {}
    });
    const [taxableAmount, setTaxableAmount] = useState<Decimal>(new Decimal(0));
    const [nonTaxableAmount, setNonTaxableAmount] = useState<Decimal>(new Decimal(0));
    const [taxTotal, setTaxTotal] = useState<Decimal>(new Decimal(0));
    const [grossAmount, setGrossAmount] = useState<Decimal>(new Decimal(0));
    const [totalAmount, setTotalAmount] = useState<Decimal>(new Decimal(0));
    const [importedGoodSummaryAmount, setImportedGoodSummaryAmount] = useState<Decimal>(new Decimal(0));
    const [importedGoodWithholding, setImportedGoodWithholding] = useState<Decimal>(new Decimal(0));
    const [localGoodSummaryAmount, setLocalGoodSummaryAmount] = useState<Decimal>(new Decimal(0));
    const [localGoodWithholding, setLocalGoodWithholding] = useState<Decimal>(new Decimal(0));
    const [serviceSummaryAmount, setServiceSummaryAmount] = useState<Decimal>(new Decimal(0));
    const [serviceWithholding, setServiceWithholding] = useState<Decimal>(new Decimal(0));
    const [withholding, setWithholding] = useState<Decimal>(new Decimal(0));


    const form = useForm<z.infer<typeof purchaseSchema>>({
        resolver: zodResolver(purchaseSchema),
        defaultValues: {},
    })
    const createPurchase = async (data: PurchaseInputType) => {
        try {
            const newPurchase = await createPurchaseAction({
                ...data
            });
            if (newPurchase) {
                return newPurchase;
            } else {
                throw new Error("Error Creating the purchase");
            }
        } catch (e) {
            console.log(e)
            throw new Error("Error Creating the purchase");
        }
    };

    const watchedProducts = useWatch({
        control: form.control,
        name: "purchaseProducts",
    });

    useEffect(() => {

        if (watchedProducts) {
            let chartOfAccountData: { [id: string]: ChartOfAccountUpdatesType } = {}
            for (let data of watchedProducts) {
                let code = data.chartOfAccount.code;
                chartOfAccountData[code] = {
                    id: data.chartOfAccount.id,
                    name: data.chartOfAccount.name,
                    code: data.chartOfAccount.code,
                    amount: chartOfAccountData[code] && chartOfAccountData[code].amount ?
                        chartOfAccountData[code].amount + data.chartOfAccount.balance :
                        data.chartOfAccount.balance,
                    quantity: chartOfAccountData[code] && chartOfAccountData[code].quantity ?
                        chartOfAccountData[code].quantity + 1 : 0
                }
            }
            setChartOfAccount((prevState) => ({
                ...prevState, // Keep other properties unchanged
                productsChartAccount: chartOfAccountData, // Update productsChartAccount
            }));
        }
        if (vendor && vendor.business?.tin) {
            if (form.getValues("taxType") === "VAT") {
                const {
                    summation
                } = vatPurchaseSummation({
                    purchaseProducts: watchedProducts,
                });
                setTotalQuantity(summation.totalQuantity)
                setTaxableAmount(summation.taxableAmount)
                setNonTaxableAmount(summation.nonTaxableAmount)
                setGrossAmount(summation.grossAmount)
                setTotalAmount(summation.totalAmount)
                setTaxTotal(summation.taxAmount)
                setWithholding(summation.withholdingAmount)
                setImportedGoodSummaryAmount(summation.importedGoodSummaryAmount)
                setImportedGoodWithholding(summation.importedGoodWithholding)
                setLocalGoodSummaryAmount(summation.localGoodSummaryAmount)
                setLocalGoodWithholding(summation.localGoodWithholding)
                setServiceSummaryAmount(summation.serviceSummaryAmount)
                setServiceWithholding(summation.serviceWithholding)
                setGrossAmount(summation.grossAmount)
            } else {
                const {
                    summation
                } = totPurchaseSummation({
                    purchaseProducts: watchedProducts,
                });

                setTotalQuantity(summation.totalQuantity)
                setGrossAmount(summation.grossAmount)
                setTotalAmount(summation.totalAmount)
                setTaxTotal(summation.taxAmount)
                setWithholding(summation.withholdingAmount)
                setLocalGoodSummaryAmount(summation.goodSummaryAmount)
                setLocalGoodWithholding(summation.goodWithholdingAmount)
                setServiceSummaryAmount(summation.serviceSummaryAmount)
                setServiceWithholding(summation.serviceWithholdingAmount)
                setGrossAmount(summation.grossAmount)
            }

        } else {
            const {
                summation
            } = UnregisteredPurchaseSummation({
                purchaseProducts: watchedProducts,
                hasWithholding: form.getValues("withholdingType") === "hasWithholding"
            });

            setTotalQuantity(summation.totalQuantity)
            setGrossAmount(summation.grossAmount)
            setTotalAmount(summation.totalAmount)
            setTaxTotal(new Decimal(0))
            setWithholding(summation.withholdingAmount)
            setGrossAmount(summation.grossAmount)

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [watchedProducts]);

    return (
        <AddPurchasesContext.Provider
            value={{
                createPurchase,
                form,
                setVendor,
                vendor,
                grossAmount,
                taxTotal,
                totalQuantity,
                nonTaxableAmount,
                importedGoodSummaryAmount,
                importedGoodWithholding,
                localGoodSummaryAmount,
                localGoodWithholding,
                serviceSummaryAmount,
                serviceWithholding,
                withholding,
                taxableAmount,
                totalAmount,
                purchaseProducts: watchedProducts,
                chartOfAccount,
                setChartOfAccount
            }}
        >
            {children}
        </AddPurchasesContext.Provider>
    );
};

export { AddPurchasesProvider, useAddPurchases };
