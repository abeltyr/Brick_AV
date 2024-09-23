'use client'

import React, { useCallback, useContext, useState } from "react";
import { DateRangeType } from '@/types/shared';
import { secondsInAWeek } from '@/lib/utils/calendar/date';
import { fetchDailyPurchaseReportAction, fetchMonthlyPurchaseReportAction, fetchYearlyPurchaseReportAction } from '@/lib/data/purchaseReport/fetchByRange';
import { PurchaseReportType } from '@/types/report';

export const defaultDateRange: DateRangeType = {
    startDate: new Date(new Date().getTime() - secondsInAWeek * 1000),
    endDate: new Date(),
    name: "Weekly"
}


const initialValues: {
    purchasesReport: {
        [id: string]: {
            [date: string]: PurchaseReportType
        }
    };
    fetchPurchaseReport: ({ }: { companyId: string, date: DateRangeType }) => void;
    loading: boolean;
    dateRange: DateRangeType,
    updateDateRange: ({ companyId, date, }: {
        companyId: string,
        date: DateRangeType,
    }) => Promise<PurchaseReportType | null>
} = {
    purchasesReport: {},
    fetchPurchaseReport: ({ }: { companyId: string, date: DateRangeType }) => { },
    loading: true,
    dateRange: { ...defaultDateRange },
    updateDateRange: async ({ companyId, date, }: {
        companyId: string,
        date: DateRangeType,
    }) => { return null }
};



type Props = {
    children?: React.ReactNode;
};

const PurchaseReportContext = React.createContext(initialValues);

const usePurchaseReport = () => useContext(PurchaseReportContext);

const PurchaseReportProvider: React.FC<Props> = ({ children }) => {

    const [loading, setLoading] = useState<boolean>(true);
    const [dateRange, setDateRange] = useState<DateRangeType>({ ...defaultDateRange });
    const [purchasesReport, setPurchasesReport] = useState<{
        [id: string]: {
            [date: string]: PurchaseReportType
        }
    }>({});

    const fetchPurchaseReport = useCallback(
        async ({ companyId, date, }: {
            companyId: string,
            date: DateRangeType,
        }) => {
            setLoading(true);
            try {
                const purchasesData = { ...purchasesReport };
                let newPurchaseReport;
                if (date.name === "Weekly") {
                    newPurchaseReport = await fetchDailyPurchaseReportAction({
                        companyId,
                        date
                    });
                }
                else if (date.name === "Bi-Weekly") {
                    newPurchaseReport = await fetchDailyPurchaseReportAction({
                        companyId,
                        date
                    });
                }
                else if (date.name === "Custom Range") {
                    newPurchaseReport = await fetchDailyPurchaseReportAction({
                        companyId,
                        date
                    });
                }
                else if (date.name === "Monthly") {

                    newPurchaseReport = await fetchMonthlyPurchaseReportAction({
                        companyId,
                        year: {
                            start: date.startDate.getFullYear(),
                            end: date.endDate.getFullYear()
                        },
                        month: {
                            start: date.startDate.getMonth(),
                            end: date.endDate.getMonth()
                        }
                    });
                }
                else if (date.name === "Quarterly") {
                    newPurchaseReport = await fetchMonthlyPurchaseReportAction({
                        companyId,
                        year: {
                            start: date.startDate.getFullYear(),
                            end: date.endDate.getFullYear()
                        },
                        month: {
                            start: date.startDate.getMonth(),
                            end: date.endDate.getMonth()
                        }
                    });
                }
                else if (date.name === "Yearly") {
                    newPurchaseReport = await fetchYearlyPurchaseReportAction({
                        companyId,
                        year: {
                            start: date.startDate.getFullYear(),
                            end: date.endDate.getFullYear()
                        },
                    });
                }

                if (newPurchaseReport) {
                    // Initialize purchasesData as an empty object if it doesn't exist
                    purchasesData[companyId] = purchasesData[companyId] || {};

                    // Initialize purchasesData[companyId][date.name] if it doesn't exist
                    purchasesData[companyId][date.name] = purchasesData[companyId][date.name] || {};

                    // Now you can safely assign newPurchaseReport
                    purchasesData[companyId][date.name] = newPurchaseReport;

                }


                setPurchasesReport(purchasesData);
                setLoading(false);

                return newPurchaseReport;
            } catch (e) {
                console.log("error", e);
                setLoading(false);
            }
        },
        [purchasesReport],
    );



    const updateDateRange = async ({ companyId, date, }: {
        companyId: string,
        date: DateRangeType,
    }): Promise<PurchaseReportType | null> => {
        try {
            const value = await fetchPurchaseReport({ companyId, date });
            setDateRange(date);
            localStorage.setItem("PurchaseDateRange", JSON.stringify(date));
            if (value)
                return value;
            else
                return null
        } catch (e) {
            console.log(e)
            return null
        }

    }




    return (
        <PurchaseReportContext.Provider
            value={{
                dateRange,
                fetchPurchaseReport,
                loading,
                purchasesReport,
                updateDateRange,
            }}
        >
            {children}
        </PurchaseReportContext.Provider>
    );
};

export { PurchaseReportProvider, usePurchaseReport };
