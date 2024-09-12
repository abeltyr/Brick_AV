'use client'

import { createPurchaseAction } from '@/lib/data/purchase/create';
import { fetchPurchasesByCompanyIdAction } from '@/lib/data/purchase/fetchByCompanyId';
import { filter, Filter, loadLimit } from '@/types/shared';
import { PurchaseInputType, PurchaseReportType, PurchaseType } from '@/types/purchase';
import React, { useCallback, useContext, useState } from "react";
import { toEthiopian, } from '@/lib/utils/calendar';
import { fetchPurchaseReportAction } from '@/lib/data/purchaseReport/fetchByCompanyId';
import { DateRangeType } from '@/types/shared';
import { secondsInADay } from '@/lib/utils/calendar/date';

const initialValues: {
    purchases: { [id: string]: PurchaseType[] };
    purchasesReport: { [id: string]: PurchaseReportType };
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
    year: number,
    updateYear: (value: number) => void
    month: number,
    updateMonth: (value: number) => void
    getPurchaseReport: ({ companyId }: {
        companyId: string,
        yearData: number,
        monthData: number,
    }) => void;
    fetchingPurchaseReport: boolean
} = {
    purchases: {},
    purchasesReport: {},
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
    year: 2017,
    updateYear: (value: number) => { },
    month: 1,
    updateMonth: (value: number) => { },
    getPurchaseReport: ({ companyId }: {
        companyId: string,
        yearData: number,
        monthData: number,
    }) => { },
    fetchingPurchaseReport: true
};



type Props = {
    children?: React.ReactNode;
};

const PurchasesContext = React.createContext(initialValues);

const usePurchases = () => useContext(PurchasesContext);

const PurchasesProvider: React.FC<Props> = ({ children }) => {
    const georgiaYear = new Date();
    const ethiopiaYear = toEthiopian({
        date: 1,
        month: georgiaYear.getMonth() + 1,
        year: georgiaYear.getFullYear()
    });

    const [purchases, setPurchases] = useState<{ [id: string]: PurchaseType[] }>({});
    const [loadMoreData, setLoadMoreData] = useState<boolean>(true);
    const [fetchingPurchases, setFetchingPurchases] = useState<boolean>(false);
    const [initialLoading, setInitialLoading] = useState<boolean>(true);
    const [year, setYear] = useState<number>(ethiopiaYear ? ethiopiaYear.year : 2016);
    const [month, setMonth] = useState<number>(ethiopiaYear ? ethiopiaYear.month : 12);

    const [dateRange, setDateRange] = useState<DateRangeType>({
        startDate: new Date(new Date().getTime() - secondsInADay * 1000),
        endDate: new Date(),
    });

    const [purchasesReport, setPurchasesReport] = useState<{ [id: string]: PurchaseReportType }>({});
    const [fetchingPurchaseReport, setFetchingPurchaseReport] = useState<boolean>(false);

    const getPurchaseReport = useCallback(
        async ({ companyId, yearData, monthData }: {
            companyId: string,
            yearData: number,
            monthData: number,
        }) => {
            setFetchingPurchaseReport(true);
            try {
                const purchaseReport = await fetchPurchaseReportAction({
                    companyId,
                    year: yearData,
                    month: monthData
                });
                const purchasesData = { ...purchasesReport };
                if (purchaseReport)
                    purchasesData[`${companyId}_${yearData}_${monthData}`] = purchaseReport;

                setPurchasesReport(purchasesData);
            } catch (e) {
                console.log(e);
            }
            setFetchingPurchaseReport(false);
        },
        [purchasesReport],
    );



    const updateYear = (value: number) => {
        setYear(value);
    }

    const updateMonth = (value: number) => {
        setMonth(value);
    }


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
        async ({ companyId, yearData, monthData }: {
            companyId: string,
            yearData: number,
            monthData: number,

        }) => {
            setInitialLoading(true);
            try {
                const newPurchases = await fetchPurchasesByCompanyIdAction({
                    companyId,
                    filter,
                    year: yearData,
                    month: monthData
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
                        year,
                        month
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
        [fetchingPurchases, purchases, year, month],
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
                year,
                month,
                updateMonth,
                updateYear,
                getPurchaseReport,
                purchasesReport,
                fetchingPurchaseReport
            }}
        >
            {children}
        </PurchasesContext.Provider>
    );
};

export { PurchasesProvider, usePurchases };
