'use client'

import { fetchPurchasesByCompanyIdAction } from '@/lib/data/purchase/fetchByCompanyId';
import { filter, Filter, loadLimit } from '@/types/shared';
import { PurchaseType } from '@/types/purchase';
import React, { useCallback, useContext, useState } from "react";
import { DateRangeType } from '@/types/shared';
import { defaultDateRange } from '@/lib/utils/calendar/date';

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
