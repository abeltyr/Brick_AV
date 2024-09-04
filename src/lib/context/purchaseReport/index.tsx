'use client'

import { createPurchaseAction } from '@/lib/data/purchaseReport/create';
import { fetchPurchaseReportByCompanyIdAction } from '@/lib/data/purchaseReport/fetchByCompanyId';
import { filter, Filter, loadLimit } from '@/types/shared';
import { PurchaseType } from '@/types/purchaseReport';
import React, { useCallback, useContext, useState } from "react";
import Decimal from 'decimal.js';
import { ProductUnit } from '@prisma/client';
import { ProductInputType, PurchaseInputType } from '@/types/product'
import { toEthiopian, } from '@/lib/utils/calendar';

const initialValues: {
    purchaseReports: { [id: string]: PurchaseType[] };
    loadMoreData: boolean;
    setupPurchaseReportData: ({ dataPurchaseReport, companyId }: { dataPurchaseReport: PurchaseType[], companyId: string }) => void;
    fetchPurchaseReport: ({ companyId }: { companyId: string }) => void;
    getPurchase: ({ companyId }: {
        companyId: string,
        yearData: number,
        monthData: number,
    }) => void;
    fetchingPurchaseReport: boolean;
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
            purchaseReportType: PurchaseInputType;
            unit: ProductUnit;
            purchaseReportProducts: {
                productId: string;
                type: ProductInputType;
                purchaseReportType: PurchaseInputType;
                unit: ProductUnit;
                unitPrice: Decimal;
                quantity: number;
            }[];

        }
    }) => void;
    year: number,
    updateYear: (value: number) => void
    month: number,
    updateMonth: (value: number) => void
} = {
    purchaseReports: {},
    loadMoreData: true,
    setupPurchaseReportData: ({ }: { dataPurchaseReport: PurchaseType[], companyId: string }) => { },
    fetchPurchaseReport: ({ }: { companyId: string }) => { },
    getPurchase: ({ }: {
        companyId: string,
        yearData: number,
        monthData: number,
    }) => { },
    fetchingPurchaseReport: true,
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
            purchaseReportType: PurchaseInputType;
            unit: ProductUnit;
            purchaseReportProducts: {
                productId: string;
                type: ProductInputType;
                purchaseReportType: PurchaseInputType;
                unit: ProductUnit;
                unitPrice: Decimal;
                quantity: number;
            }[];

        }
    }) => { },
    year: 2016,
    updateYear: (value: number) => { },
    month: 12,
    updateMonth: (value: number) => { }
};

type Props = {
    children?: React.ReactNode;
};

const PurchaseReportContext = React.createContext(initialValues);

const usePurchaseReport = () => useContext(PurchaseReportContext);

const PurchaseReportProvider: React.FC<Props> = ({ children }) => {
    const georgiaYear = new Date();
    const ethiopiaYear = toEthiopian({
        date: 1,
        month: georgiaYear.getMonth() + 1,
        year: georgiaYear.getFullYear()
    });
    const [purchaseReports, setPurchaseReport] = useState<{ [id: string]: PurchaseType[] }>({});
    const [loadMoreData, setLoadMoreData] = useState<boolean>(true);
    const [fetchingPurchaseReport, setFetchingPurchaseReport] = useState<boolean>(false);
    const [initialLoading, setInitialLoading] = useState<boolean>(true);
    const [year, setYear] = useState<number>(ethiopiaYear ? ethiopiaYear.year : 2016);
    const [month, setMonth] = useState<number>(ethiopiaYear ? ethiopiaYear.month : 12);


    const updateYear = (value: number) => {
        setYear(value);
    }

    const updateMonth = (value: number) => {
        setMonth(value);
    }



    const setupPurchaseReportData = ({ dataPurchaseReport, companyId }: { dataPurchaseReport: PurchaseType[], companyId: string }) => {
        const purchaseReportsData = { ...purchaseReports };
        purchaseReportsData[companyId] = dataPurchaseReport;
        setPurchaseReport(purchaseReportsData);

        if (dataPurchaseReport.length < loadLimit) {
            setLoadMoreData(false);
        } else {
            setLoadMoreData(true);
        }
        setFetchingPurchaseReport(false);
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
            purchaseReportType: PurchaseInputType;
            unit: ProductUnit;
            purchaseReportProducts: {
                productId: string;
                type: ProductInputType;
                purchaseReportType: PurchaseInputType;
                unit: ProductUnit;
                unitPrice: Decimal;
                quantity: number;
            }[];
        }
    }) => {
        try {
            const purchaseReportsData = { ...purchaseReports };
            const newPurchase = await createPurchaseAction({
                companyId,
                ...data
            });
            if (newPurchase) {

                if (purchaseReportsData[companyId]) {
                    purchaseReportsData[companyId] = [newPurchase.purchaseReport, ...purchaseReportsData[companyId]];
                } else {
                    purchaseReportsData[companyId] = [newPurchase.purchaseReport];
                }
                setPurchaseReport(purchaseReportsData);

                return newPurchase;
            }
        } catch (e) {
            console.log(e)
            throw new Error("Error Creating the purchaseReport");
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
                const newPurchaseReport = await fetchPurchaseReportByCompanyIdAction({
                    companyId,
                    filter,
                    year: yearData,
                    month: monthData
                });
                console.log("newPurchaseReport", newPurchaseReport)
                const purchaseReportsData = { ...purchaseReports };
                purchaseReportsData[companyId] = [...newPurchaseReport];
                if (newPurchaseReport.length < loadLimit) {
                    setLoadMoreData(false);
                } else {
                    setLoadMoreData(true);
                }
                setPurchaseReport(purchaseReportsData);
            } catch (e) {
                console.log(e);
            }
            setInitialLoading(false);
        },
        [purchaseReports],
    );

    const fetchPurchaseReport = useCallback(
        async ({ companyId }: { companyId: string }) => {
            if (!fetchingPurchaseReport) {
                setFetchingPurchaseReport(true);
                try {
                    const filter: Filter = {
                        limit: loadLimit,
                    };

                    if (purchaseReports[companyId] && purchaseReports[companyId].length > 0) {
                        filter.after = purchaseReports[companyId][purchaseReports[companyId].length - 1].id;
                    }
                    const purchaseReportsData = { ...purchaseReports };
                    const newPurchaseReport = await fetchPurchaseReportByCompanyIdAction({
                        companyId,
                        filter,
                        year,
                        month
                    });

                    if (purchaseReportsData[companyId]) {
                        purchaseReportsData[companyId] = [...purchaseReportsData[companyId], ...newPurchaseReport];
                    } else {
                        purchaseReportsData[companyId] = [...newPurchaseReport];
                    }

                    setPurchaseReport(purchaseReportsData);
                    if (newPurchaseReport.length < loadLimit) {
                        setLoadMoreData(false);
                    }
                } catch (e) {
                    console.log(e);
                    alert("e");
                }
                setFetchingPurchaseReport(false);
            }
        },
        [fetchingPurchaseReport, purchaseReports, year, month],
    );

    return (
        <PurchaseReportContext.Provider
            value={{
                purchaseReports,
                initialLoading,
                loadMoreData,
                setupPurchaseReportData,
                fetchingPurchaseReport,
                fetchPurchaseReport,
                createPurchase,
                getPurchase,
                year,
                month,
                updateMonth,
                updateYear
            }}
        >
            {children}
        </PurchaseReportContext.Provider>
    );
};

export { PurchaseReportProvider, usePurchaseReport };
