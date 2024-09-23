'use client'

import { createPurchaseAction } from '@/lib/data/purchase/create';
import { fetchPurchasesByCompanyIdAction } from '@/lib/data/purchase/fetchByCompanyId';
import { filter, Filter, loadLimit } from '@/types/shared';
import { PurchaseInputType, PurchaseType } from '@/types/purchase';
import React, { useCallback, useContext, useState } from "react";
import { DateRangeType } from '@/types/shared';
import { defaultDateRange } from '../purchaseReport';

const initialValues: {
    loading: boolean;
    error: boolean;
    isLoading: boolean,
    loadMoreData: boolean;
    purchases: { [id: string]: PurchaseType[] };
    fetchPurchases: ({ companyId }: { companyId: string }) => void;
    getPurchase: ({ companyId }: {
        companyId: string,
    }) => void;
    createPurchase: ({ }: PurchaseInputType) => void;
    dateRange: DateRangeType,
    setDateRange: (date: DateRangeType,) => void
} = {
    loading: true,
    error: false,
    loadMoreData: true,
    isLoading: false,
    purchases: {},
    fetchPurchases: ({ }: { companyId: string }) => { },
    getPurchase: ({ }: {
        companyId: string,
    }) => { },
    createPurchase: ({ }: PurchaseInputType) => { },
    dateRange: { ...defaultDateRange },
    setDateRange: (date: DateRangeType,) => { }
};



type Props = {
    children?: React.ReactNode;
};

const PurchasesContext = React.createContext(initialValues);

const usePurchases = () => useContext(PurchasesContext);

const PurchasesProvider: React.FC<Props> = ({ children }) => {

    const [purchases, setPurchases] = useState<{ [id: string]: PurchaseType[] }>({});
    const [loadMoreData, setLoadMoreData] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const [dateRange, setDateRange] = useState<DateRangeType>({ ...defaultDateRange });


    const createPurchase = async (data: PurchaseInputType) => {
        try {
            const purchasesData = { ...purchases };
            const newPurchase = await createPurchaseAction({
                ...data
            });
            if (newPurchase) {

                if (purchasesData[data.companyId]) {
                    purchasesData[data.companyId] = [newPurchase.purchase, ...purchasesData[data.companyId]];
                } else {
                    purchasesData[data.companyId] = [newPurchase.purchase];
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
        async ({ companyId }: {
            companyId: string,
        }) => {
            setLoading(true);
            try {
                const newPurchases = await fetchPurchasesByCompanyIdAction({
                    companyId,
                    filter,
                });
                const purchasesData = { ...purchases };
                purchasesData[companyId] = [...newPurchases];
                if (newPurchases.length < loadLimit) {
                    setLoadMoreData(false);
                } else {
                    setLoadMoreData(true);
                }
                setPurchases(purchasesData);
                setLoading(false);
            } catch (e) {
                console.log(e);
                setLoading(false);
                setError(true);
            }
        },
        [purchases],
    );

    const fetchPurchases = useCallback(
        async ({ companyId }: { companyId: string }) => {
            if (!isLoading) {
                setIsLoading(true);
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
                    setIsLoading(false);
                } catch (e) {
                    console.log(e);
                    setIsLoading(false);
                    setError(true);
                }
            }
        },
        [isLoading, purchases],
    );

    return (
        <PurchasesContext.Provider
            value={{
                purchases,
                loading,
                error,
                loadMoreData,
                fetchPurchases,
                createPurchase,
                getPurchase,
                dateRange,
                setDateRange,
                isLoading
            }}
        >
            {children}
        </PurchasesContext.Provider>
    );
};

export { PurchasesProvider, usePurchases };
