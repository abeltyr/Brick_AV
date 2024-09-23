'use client'

import React, { useCallback, useContext, useEffect, useState } from "react";
import { fetchMemberCompanyAction } from '@/lib/data/companyMember/fetchById';
import { CompanyMemberType } from '@/types/company';


const initialValues: {
    loading: boolean,
    companies: CompanyMemberType[],
    companyIndex: number,
    currentCompany: CompanyMemberType | null,
    updateCompanyIndex: (index: number) => void,
    fetchCompanies: ({ userId, refetch }: { userId: string, refetch?: boolean }) => void
} = {
    loading: true,
    companies: [],
    companyIndex: 0,
    currentCompany: null,
    updateCompanyIndex: (index: number) => { },
    fetchCompanies: ({ }: { userId: string, refetch?: boolean }) => { }
};

type Props = {
    children?: React.ReactNode;
};

const CompanyContext = React.createContext(initialValues);

const useCompany = () => useContext(CompanyContext);

const CompanyProvider: React.FC<Props> = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [companies, setCompanies] = useState<CompanyMemberType[]>([])
    const [currentCompany, setCurrentCompany] = useState<CompanyMemberType | null>(null)
    const [companyIndex, setCompanyIndex] = useState<number>(0)

    const updateCompanyIndex = useCallback(
        async (index: number) => {
            setCompanyIndex(index)
            setCurrentCompany(companies && companies[index])
        },
        [companies],
    );

    const fetchCompanies = useCallback(
        async ({ userId, refetch = false }: { userId: string, refetch?: boolean }) => {

            console.log("fetchCompanies useEffect session", userId)
            setLoading(true);
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
                    console.log("memberData", userId)
                    localStorage.setItem("memberData", JSON.stringify({
                        memberData: memberData,
                        date: new Date().getTime()
                    }))
                    setCompanies(memberData);
                    setCurrentCompany(memberData && memberData[0])
                    console.log("new Save", memberData);

                }
            } catch (e) {
                console.error(e)
            }
            setLoading(false);
            console.log("companies", companies);
        },
        [companies],
    );

    return (
        <CompanyContext.Provider
            value={{
                loading,
                companyIndex,
                companies,
                updateCompanyIndex,
                currentCompany,
                fetchCompanies
            }}
        >
            {children}
        </CompanyContext.Provider>
    );
};

export { CompanyProvider, useCompany };