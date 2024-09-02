'use client'

import { createPurchaseAction } from '@/lib/data/purchase/create';
import { fetchPurchasesByCompanyIdAction } from '@/lib/data/purchase/fetchByCompanyId';
import { filter, Filter, loadLimit } from '@/types/shared';
import { PurchaseType } from '@/types/purchase';
import React, { useCallback, useContext, useState } from "react";
import Decimal from 'decimal.js';
import { ProductType, ProductUnit } from '@prisma/client';
import { ProductInputType, PurchaseInputType } from '@/types/product'
const initialValues: {
    purchases: { [id: string]: PurchaseType[] };
    loadMoreData: boolean;
    setupPurchasesData: ({ dataPurchases, companyId }: { dataPurchases: PurchaseType[], companyId: string }) => void;
    fetchPurchases: ({ companyId }: { companyId: string }) => void;
    getPurchase: ({ companyId }: { companyId: string }) => void;
    fetchingPurchases: boolean;
    initialLoading: boolean;
    createPurchase: ({ }: {
        companyId: string;
        data: {
            vendorId: string;
            date: Date;
            MRCNumber?: string;
            VatReceiptNumber?: string;
            invoiceNumber?: string;
            productType: ProductInputType;
            purchaseType: PurchaseInputType;
            unit: ProductUnit;
            purchaseProducts: {
                productId: string;
                type: ProductInputType;
                purchaseType: PurchaseInputType;
                unit: ProductUnit;
                unitPrice: Decimal;
                quantity: number;
            }[];

        }
    }) => void;
} = {
    purchases: {},
    loadMoreData: true,
    setupPurchasesData: ({ }: { dataPurchases: PurchaseType[], companyId: string }) => { },
    fetchPurchases: ({ }: { companyId: string }) => { },
    getPurchase: ({ }: { companyId: string }) => { },
    fetchingPurchases: true,
    initialLoading: true,
    createPurchase: ({ }: {
        companyId: string;
        data: {
            vendorId: string;
            date: Date;
            MRCNumber?: string;
            VatReceiptNumber?: string;
            invoiceNumber?: string;
            productType: ProductInputType;
            purchaseType: PurchaseInputType;
            unit: ProductUnit;
            purchaseProducts: {
                productId: string;
                type: ProductInputType;
                purchaseType: PurchaseInputType;
                unit: ProductUnit;
                unitPrice: Decimal;
                quantity: number;
            }[];

        }
    }) => { },
};

type Props = {
    children?: React.ReactNode;
};

const PurchasesContext = React.createContext(initialValues);

const usePurchases = () => useContext(PurchasesContext);

const PurchasesProvider: React.FC<Props> = ({ children }) => {
    const [purchases, setPurchases] = useState<{ [id: string]: PurchaseType[] }>({});
    const [loadMoreData, setLoadMoreData] = useState<boolean>(true);
    const [fetchingPurchases, setFetchingPurchases] = useState<boolean>(false);
    const [initialLoading, setInitialLoading] = useState<boolean>(true);

    const setupPurchasesData = ({ dataPurchases, companyId }: { dataPurchases: PurchaseType[], companyId: string }) => {
        const purchasesData = { ...purchases };
        purchasesData[companyId] = dataPurchases;
        setPurchases(purchasesData);

        if (dataPurchases.length < loadLimit) {
            setLoadMoreData(false);
        } else {
            setLoadMoreData(true);
        }
        setFetchingPurchases(false);
    };

    const createPurchase = async ({ data, companyId }: {
        companyId: string;
        data: {
            vendorId: string;
            date: Date;
            MRCNumber?: string;
            VatReceiptNumber?: string;
            invoiceNumber?: string;
            productType: ProductInputType;
            purchaseType: PurchaseInputType;
            unit: ProductUnit;
            purchaseProducts: {
                productId: string;
                type: ProductInputType;
                purchaseType: PurchaseInputType;
                unit: ProductUnit;
                unitPrice: Decimal;
                quantity: number;
            }[];
        }
    }) => {
        try {
            const purchasesData = { ...purchases };
            const newPurchase = await createPurchaseAction({
                companyId,
                ...data
            });
            if (newPurchase) {

                if (purchasesData[companyId]) {
                    purchasesData[companyId] = [newPurchase.purchase, ...purchasesData[companyId]];
                } else {
                    purchasesData[companyId] = [newPurchase.purchase];
                }
                setPurchases(purchasesData);

                return newPurchase;
            }
        } catch (e) {
            console.log(e)
            throw new Error("Error Creating the purchase");
        }
    };

    const getPurchase = useCallback(
        async ({ companyId }: { companyId: string }) => {
            setInitialLoading(true);
            try {
                const newPurchases = await fetchPurchasesByCompanyIdAction({
                    companyId,
                    filter,
                });
                console.log("newPurchases", newPurchases)
                const purchasesData = { ...purchases };
                purchasesData[companyId] = [...newPurchases];
                if (newPurchases.length < loadLimit) {
                    setLoadMoreData(false);
                } else {
                    setLoadMoreData(true);
                }
                setPurchases(purchasesData);
            } catch (e) {
                console.log(e);
            }
            setInitialLoading(false);
        },
        [purchases],
    );

    const fetchPurchases = useCallback(
        async ({ companyId }: { companyId: string }) => {
            if (!fetchingPurchases) {
                setFetchingPurchases(true);
                try {
                    const filter: Filter = {
                        limit: loadLimit,
                    };

                    if (purchases[companyId] && purchases[companyId].length > 0) {
                        filter.after = purchases[companyId][purchases[companyId].length - 1].id;
                    }
                    const purchasesData = { ...purchases };
                    const newPurchases = await fetchPurchasesByCompanyIdAction({
                        companyId,
                        filter,
                    });

                    if (purchasesData[companyId]) {
                        purchasesData[companyId] = [...purchasesData[companyId], ...newPurchases];
                    } else {
                        purchasesData[companyId] = [...newPurchases];
                    }

                    setPurchases(purchasesData);
                    if (newPurchases.length < loadLimit) {
                        setLoadMoreData(false);
                    }
                } catch (e) {
                    console.log(e);
                    alert("e");
                }
                setFetchingPurchases(false);
            }
        },
        [purchases, fetchingPurchases],
    );

    return (
        <PurchasesContext.Provider
            value={{
                purchases,
                initialLoading,
                loadMoreData,
                setupPurchasesData,
                fetchingPurchases,
                fetchPurchases,
                createPurchase,
                getPurchase,
            }}
        >
            {children}
        </PurchasesContext.Provider>
    );
};

export { PurchasesProvider, usePurchases };
