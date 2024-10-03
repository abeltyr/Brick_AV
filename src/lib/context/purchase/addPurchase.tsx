'use client'

import { createPurchaseAction } from '@/lib/data/purchase/create';
import { ChartOfAccountValueInput, purchaseProducts, purchaseSchema } from '@/lib/form/purchase';
import { PurchaseInputType } from '@/types/purchase';
import React, { useContext, useEffect, useState } from "react";
import { useForm, UseFormReturn, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod"
import { VendorType } from '@/types/vendor';
import Decimal from 'decimal.js';
import { totPurchaseSummation, UnregisteredPurchaseSummation, vatPurchaseSummation } from '@/lib/utils/purchase';


type ChartOfAccountDataType = z.infer<typeof ChartOfAccountValueInput>

type ChartOfAccountListType = {
    paymentAccount: ChartOfAccountDataType | null;
    vatAccount: ChartOfAccountDataType | null;
    withHolding: ChartOfAccountDataType | null;
    productsChartAccount: {
        [id: string]: ChartOfAccountDataType;
    }
};

type purchaseProductsType = z.infer<typeof purchaseProducts>
const initialValues: {
    createPurchase: ({ }: { companyId: string, creatorId: string, purchaseInput: PurchaseInputType }) => void;
    form: UseFormReturn<z.infer<typeof purchaseSchema>> | null
    setVendor: React.Dispatch<React.SetStateAction<VendorType | null>>
    vendor: VendorType | null
    totalQuantity: number;
    taxableAmount: Decimal;
    nonTaxableAmount: Decimal;
    taxTotal: Decimal;
    goodTotTotal: Decimal;
    serviceTotTotal: Decimal;
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
    createPurchase: ({ }: { companyId: string, creatorId: string, purchaseInput: PurchaseInputType }) => { },
    form: null,
    setVendor: () => { },
    vendor: null,
    totalQuantity: 0,
    taxableAmount: new Decimal(0),
    nonTaxableAmount: new Decimal(0),
    taxTotal: new Decimal(0),
    goodTotTotal: new Decimal(0),
    serviceTotTotal: new Decimal(0),
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

    const [chartOfAccount, setChartOfAccount] = useState<ChartOfAccountListType>({
        paymentAccount: null,
        vatAccount: null,
        withHolding: null,
        productsChartAccount: {}
    });


    const [totalQuantity, setTotalQuantity] = useState<number>(0);
    const [taxableAmount, setTaxableAmount] = useState<Decimal>(new Decimal(0));
    const [nonTaxableAmount, setNonTaxableAmount] = useState<Decimal>(new Decimal(0));
    const [taxTotal, setTaxTotal] = useState<Decimal>(new Decimal(0));
    const [goodTotTotal, setGoodTotTotal] = useState<Decimal>(new Decimal(0));
    const [serviceTotTotal, setServiceTotTotal] = useState<Decimal>(new Decimal(0));
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
    const createPurchase = async ({ companyId, creatorId, purchaseInput }: { companyId: string, creatorId: string, purchaseInput: PurchaseInputType }) => {
        try {
            const newPurchase = await createPurchaseAction({
                companyId,
                creatorId,
                purchaseInput
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


    const updateChartOfAccountData = () => {
        if (watchedProducts) {
            let chartOfAccountData: { [id: string]: ChartOfAccountDataType } = {}
            for (let data of watchedProducts) {
                if (data.chartOfAccount) {
                    let code = data.chartOfAccount.code;
                    let quantity = (data.quantity) ?? 0
                    let unitPrice = data.unitPrice ?? 0

                    if (typeof (quantity) === "string") {
                        quantity = 0
                    }
                    if (typeof (unitPrice) === "string") {
                        unitPrice = 0
                    }
                    let amount = new Decimal(quantity).mul(new Decimal(unitPrice)) ?? new Decimal(0);

                    if (amount && chartOfAccountData[code] && chartOfAccountData[code].amount) {
                        amount = new Decimal(chartOfAccountData[code].amount).plus(amount);
                    }

                    if (quantity && chartOfAccountData[code] && chartOfAccountData[code].quantity) {
                        quantity = new Decimal(chartOfAccountData[code].quantity).plus(quantity).toNumber();
                    }
                    console.log("amount", amount);

                    chartOfAccountData[code] = {
                        id: data.chartOfAccount.id,
                        name: data.chartOfAccount.name,
                        code: data.chartOfAccount.code,
                        accountType: data.chartOfAccount.accountType,
                        amount: amount.toNumber(),
                        quantity,
                        balance: data.chartOfAccount.balance,
                        balanceType: data.chartOfAccount.balanceType
                    }
                }
            }
            setChartOfAccount((prevState) => ({
                ...prevState, // Keep other properties unchanged
                productsChartAccount: chartOfAccountData, // Update productsChartAccount
            }));
        }
    }


    const updateSummaryData = () => {
        if (vendor && vendor.business?.tin) {
            if (vendor.taxType === "VAT") {
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
                setTaxableAmount(summation.totalAmount)
                setTaxTotal(summation.taxAmount)
                setWithholding(summation.withholdingAmount)
                setLocalGoodSummaryAmount(summation.goodSummaryAmount)
                setLocalGoodWithholding(summation.goodWithholdingAmount)
                setServiceSummaryAmount(summation.serviceSummaryAmount)
                setServiceWithholding(summation.serviceWithholdingAmount)
                setGrossAmount(summation.grossAmount)
                setGoodTotTotal(summation.goodTaxAmount)
                setServiceTotTotal(summation.serviceTaxAmount)
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
    }


    useEffect(() => {

        updateChartOfAccountData();
        updateSummaryData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [watchedProducts, vendor]);




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
                setChartOfAccount,
                goodTotTotal,
                serviceTotTotal
            }}
        >
            {children}
        </AddPurchasesContext.Provider>
    );
};

export { AddPurchasesProvider, useAddPurchases };
