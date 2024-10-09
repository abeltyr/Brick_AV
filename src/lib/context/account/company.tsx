'use client'

import React, { useCallback, useContext, useState } from "react";
import { fetchMemberCompanyAction } from '@/lib/data/companyMember';
import { CompanyMemberType } from '@/types/company';
import { FiscalYear } from '@prisma/client';


const initialValues: {
    loading: boolean,
    error: boolean,
    companies: CompanyMemberType[],
    companyIndex: number,
    currentCompany: CompanyMemberType | null,
    updateCompanyIndex: (index: number) => void,
    fetchCompanies: ({ userId, refetch }: { userId: string, refetch?: boolean }) => void
    fiscalYear: FiscalYear | null
} = {
    loading: true,
    error: true,
    companies: [],
    companyIndex: 0,
    currentCompany: null,
    updateCompanyIndex: (index: number) => { },
    fetchCompanies: ({ }: { userId: string, refetch?: boolean }) => { },
    fiscalYear: null
};

type Props = {
    children?: React.ReactNode;
};

const CompanyContext = React.createContext(initialValues);

const useCompany = () => useContext(CompanyContext);

const CompanyProvider: React.FC<Props> = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [companies, setCompanies] = useState<CompanyMemberType[]>([])
    const [currentCompany, setCurrentCompany] = useState<CompanyMemberType | null>(null)
    const [fiscalYear, setFiscalYear] = useState<FiscalYear | null>(null)
    const [companyIndex, setCompanyIndex] = useState<number>(0)

    const updateCompanyIndex = useCallback(
        async (index: number) => {
            setCompanyIndex(index)
            setCurrentCompany(companies && companies[index])
            if (companies &&
                companies.length > index &&
                companies[index].company && companies[index].company.fiscalYear &&
                companies[index].company.fiscalYear.length > index &&
                companies[index].company.fiscalYear[index]) {

                setFiscalYear(companies[index].company.fiscalYear[index])

            }
        },
        [companies],
    );

    const fetchCompanies = useCallback(
        async ({ userId, refetch = false }: { userId: string, refetch?: boolean }) => {
            setLoading(true);
            setError(false);
            let fetchData = true;
            try {
                // const data = localStorage.getItem("memberData")

                // if (data && !refetch) {
                //     const extractData = JSON.parse(data);
                //     const minSinceLastPull = (new Date().getTime() - extractData.date) / 60000;
                //     if (minSinceLastPull < 60) {
                //         setCompanies(extractData.memberData);
                //         setCurrentCompany(extractData.memberData && extractData.memberData[0])
                //         fetchData = false;
                //         console.log("local data");
                //     }
                // }

                if (fetchData) {
                    const memberData = await fetchMemberCompanyAction(userId);
                    localStorage.setItem("memberData", JSON.stringify({
                        memberData: memberData,
                        date: new Date().getTime()
                    }))
                    setCompanies(memberData);
                    setCurrentCompany(memberData && memberData[0])
                    console.log("new Save");
                    if (memberData && memberData.length > 0 && memberData[0].company.fiscalYear.length > 0 && memberData[0].company.fiscalYear[0]) {
                        setFiscalYear(memberData[0].company.fiscalYear[0])
                    }

                }
                setLoading(false);
            } catch (e) {
                console.error(e)
                setError(true)
                setLoading(false);
            }
        },
        [],
    );

    return (
        <CompanyContext.Provider
            value={{
                loading,
                error,
                companyIndex,
                companies,
                updateCompanyIndex,
                currentCompany,
                fetchCompanies,
                fiscalYear
            }}
        >
            {children}
        </CompanyContext.Provider>
    );
};

export { CompanyProvider, useCompany };