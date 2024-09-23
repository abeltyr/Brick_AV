'use client'

import { createPurchaseAction } from '@/lib/data/purchase/create';
import { fetchPurchasesByCompanyIdAction } from '@/lib/data/purchase/fetchByCompanyId';
import { filter, Filter, loadLimit } from '@/types/shared';
import { PurchaseInputType, PurchaseType } from '@/types/purchase';
import React, { useCallback, useContext, useState } from "react";
import { toEthiopian, } from '@/lib/utils/calendar';
import { DateRangeType } from '@/types/shared';
import { secondsInADay } from '@/lib/utils/calendar/date';
import { defaultDateRange } from '../purchaseReport';

const initialValues: {
    purchases: { [id: string]: PurchaseType[] };
    loadMoreData: boolean;
    fetchPurchases: ({ companyId }: { companyId: string }) => void;
    getPurchase: ({ companyId }: {
        companyId: string,
        yearData: number,
        monthData: number,
    }) => void;
    fetchingPurchases: boolean;
    initialLoading: boolean;
    createPurchase: ({ }: PurchaseInputType) => void;
    dateRange: DateRangeType,
    setDateRange: (date: DateRangeType,) => void
} = {
    purchases: {},
    loadMoreData: true,
    fetchPurchases: ({ }: { companyId: string }) => { },
    getPurchase: ({ }: {
        companyId: string,
        yearData: number,
        monthData: number,
    }) => { },
    fetchingPurchases: true,
    initialLoading: true,
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
    const [fetchingPurchases, setFetchingPurchases] = useState<boolean>(false);
    const [initialLoading, setInitialLoading] = useState<boolean>(true);
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
            setInitialLoading(true);
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
        [fetchingPurchases, purchases],
    );

    return (
        <PurchasesContext.Provider
            value={{
                purchases,
                initialLoading,
                loadMoreData,
                fetchingPurchases,
                fetchPurchases,
                createPurchase,
                getPurchase,
                dateRange,
                setDateRange
            }}
        >
            {children}
        </PurchasesContext.Provider>
    );
};

export { PurchasesProvider, usePurchases };
