'use client'

import { createChartOfAccountAction } from '@/lib/data/chartOfAccount/create';
import { fetchChartOfAccountAction } from '@/lib/data/chartOfAccount/fetchByCompanyId';
import { ChartOfAccountInputType, ChartOfAccountType } from '@/types/purchase';
import React, { use, useCallback, useContext, useEffect, useState } from "react";



const initialValues: {
    loading: boolean,
    error: boolean,
    chartOfAccounts: { [id: string]: ChartOfAccountType[] },
    getChartOfAccounts: ({ companyId, refetch }: { companyId: string, fiscalYearId: string, refetch?: boolean }) => void,
    createCOA: ({ }: { companyId: string, creatorId: string, data: ChartOfAccountInputType }) => Promise<ChartOfAccountType | null>
} = {
    loading: true,
    error: true,
    chartOfAccounts: {},
    getChartOfAccounts: ({ }: { companyId: string, fiscalYearId: string, refetch?: boolean }) => { },
    createCOA: async ({ }: { companyId: string, creatorId: string, data: ChartOfAccountInputType }): Promise<ChartOfAccountType | null> => { return null }
};

type Props = {
    children?: React.ReactNode;
};

const ChartOfAccountContext = React.createContext(initialValues);

const useChartOfAccount = () => useContext(ChartOfAccountContext);

const ChartOfAccountProvider: React.FC<Props> = ({ children }) => {

    const [chartOfAccounts, setChartOfAccounts] = useState<{ [id: string]: ChartOfAccountType[] }>({})
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);



    const createCOA = async ({ data, companyId, creatorId }: {
        companyId: string,
        creatorId: string,
        data: ChartOfAccountInputType
    }
    ): Promise<ChartOfAccountType | null> => {
        try {
            const chartOfAccountsData = { ...chartOfAccounts };
            const newChartOfAccounts = await createChartOfAccountAction({
                creatorId,
                companyId,
                data: {
                    ...data
                }
            });
            chartOfAccountsData[companyId] = [newChartOfAccounts as ChartOfAccountType, ...chartOfAccountsData[companyId]];
            setChartOfAccounts(chartOfAccountsData);
            return newChartOfAccounts;
        } catch (e: any) {
            throw new Error(e.message);
        }
    };

    const getChartOfAccounts = useCallback(
        async ({ companyId, fiscalYearId, refetch = false }: { companyId: string, fiscalYearId: string, refetch?: boolean }) => {
            setLoading(true);
            setError(false);
            try {

                let fetchData = true;
                // const data = localStorage.getItem("ChartOfAccount")

                // if (data && !refetch) {
                //     const extractData = JSON.parse(data);
                //     const minSinceLastPull = (new Date().getTime() - extractData.date) / 60000;
                //     if (minSinceLastPull < 60 && extractData.chartOfAccountsData[companyId] && extractData.chartOfAccountsData[companyId].length > 100) {
                //         setChartOfAccounts(extractData.chartOfAccountsData);
                //         fetchData = false;
                //         console.log("local data, chartOfAccountsData");
                //     }
                // }

                if (fetchData) {
                    const newChartOfAccountsData = await fetchChartOfAccountAction({
                        companyId,
                        fiscalYearId,
                        filter: {
                            limit: 1000
                        },
                    });
                    const chartOfAccountsData = { ...chartOfAccounts };
                    chartOfAccountsData[companyId] = [...newChartOfAccountsData];

                    setChartOfAccounts(chartOfAccountsData);

                }
                setLoading(false);
            } catch (e) {
                console.log(e);
                setLoading(false);
                setError(true);
            }
        },
        [chartOfAccounts],
    );



    return (
        <ChartOfAccountContext.Provider
            value={{
                loading,
                error,
                chartOfAccounts,
                createCOA,
                getChartOfAccounts
            }}
        >
            {children}
        </ChartOfAccountContext.Provider>
    );
};

export { ChartOfAccountProvider, useChartOfAccount };