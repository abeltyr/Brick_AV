'use client'

import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Session } from '@supabase/supabase-js';
import { createClient } from '@/lib/utils/supabase/client';
import { signInWithPasswordAction } from '@/lib/data/account/signIn';
import { getUserAction, refreshAccountToken } from '@/lib/data/account/fetch';
import { logoutAction } from '@/lib/data/account/logout';
import { fetchMemberCompanyAction } from '@/lib/data/companyMember/fetchById';
import { CompanyMemberType } from '@/types/company';
import LoadingSVG from '@/assets/icons/loading';


const initialValues: {
    session: Session | null,
    loading: boolean,
    companies: CompanyMemberType[] | null,
    companyIndex: number,
    companyLoading: boolean
    currentCompany: CompanyMemberType | null,
    updateCompanyIndex: (index: number) => void,
    login: ({ email, password }: { email: string, password: string }) => void,
    logout: () => void,
    fetchUser: () => void,
    updateUser: ({ }: {}) => void,
} = {
    session: null,
    loading: true,
    companies: null,
    companyIndex: 0,
    currentCompany: null,
    companyLoading: true,
    updateCompanyIndex: (index: number) => { },
    login: ({ }: { email: string, password: string }) => { },
    logout: () => { },
    fetchUser: () => { },
    updateUser: ({ }: {}) => { },
};

type Props = {
    children?: React.ReactNode;
};

const AuthContext = React.createContext(initialValues);

const useAuth = () => useContext(AuthContext);

const AuthProvider: React.FC<Props> = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [companyLoading, setCompanyLoading] = useState(true);
    const [session, setSession] = useState<Session | null>(null)
    const [companies, setCompanies] = useState<CompanyMemberType[] | null>(null)
    const [currentCompany, setCurrentCompany] = useState<CompanyMemberType | null>(null)
    const [companyIndex, setCompanyIndex] = useState<number>(0)


    const dataSetter = async () => {
        const supabase = createClient();
        const { data } = await supabase.auth.getSession();
        setSession(data.session)
        setLoading(false);
    }


    useEffect(() => {
        const supabase = createClient();
        dataSetter();
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (_event, session: Session | null) => {
            if (session) {
                const expiresAt = session.expires_at
                const currentTime = Math.floor(Date.now() / 1000) // convert to Unix timestamp
                if (expiresAt && expiresAt - currentTime < 300) {
                    refreshAccountSession();
                }
            }
            setSession(session)
            if (session)
                await fetchCompanies({ userId: session.user.id });
        })

        return () => subscription.unsubscribe()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])



    const updateCompanyIndex = useCallback(
        async (index: number) => {
            setCompanyIndex(index)
            setCurrentCompany(companies && companies[index])
        },
        [companies],
    );

    const login = useCallback(
        async ({ email, password }: { email: string, password: string }) => {
            try {
                let user = await signInWithPasswordAction({
                    email,
                    password,
                });
                return user
            } catch (e) {
                console.error(e)
                throw new Error("error")
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    const refreshAccountSession = useCallback(
        async () => {
            setLoading(true);
            try {
                const data = await refreshAccountToken();
                setSession(data.session);
            } catch (e) {
                await logout();
                setSession(null);
            }
            setLoading(false);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    const fetchUser = useCallback(
        async () => {
            setLoading(true);
            try {
                let value = await getUserAction();
                if (value) {
                    await fetchCompanies({ userId: value.user.id, });
                    return value.user;
                }
            } catch (e) {
                console.error(e)
            }
            setLoading(false);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    const fetchCompanies = useCallback(
        async ({ userId, refetch = false }: { userId: string, refetch?: boolean }) => {
            setCompanyLoading(true);
            let fetchData = true;
            try {
                const data = localStorage.getItem("memberData")

                if (data && !refetch) {
                    const extractData = JSON.parse(data);
                    const minSinceLastPull = (new Date().getTime() - extractData.date) / 60000;
                    if (minSinceLastPull < 60) {
                        setCompanies(extractData.memberData);
                        setCurrentCompany(extractData.memberData && extractData.memberData[0])
                        fetchData = false;
                        console.log("local data");
                    }
                }

                if (!companies && fetchData) {
                    const memberData = await fetchMemberCompanyAction(userId);
                    localStorage.setItem("memberData", JSON.stringify({
                        memberData: memberData,
                        date: new Date().getTime()
                    }))
                    setCompanies(memberData);
                    setCurrentCompany(memberData && memberData[0])
                    console.log("new Save");

                }
            } catch (e) {
                console.error(e)
            }
            setCompanyLoading(false);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    const logout = useCallback(
        async () => {
            try {
                let user = await logoutAction();
                setSession(null);
            } catch (e) {
                console.error(e)
            }
        },
        [],
    );


    console.log("session && companyLoading", (session === null && loading) || session && companyLoading)
    if ((session === null && loading) || session && companyLoading)
        return <div className='w-screen h-screen flex justify-center items-center text-primary'>
            <LoadingSVG className='w-20 h-20 animate-spin' />
        </div>
    else
        return (
            <AuthContext.Provider
                value={{
                    session,
                    fetchUser,
                    login,
                    logout: logout,
                    updateUser: () => { },
                    loading,
                    companyIndex,
                    companies,
                    companyLoading,
                    updateCompanyIndex,
                    currentCompany
                }}
            >
                {children}
            </AuthContext.Provider>
        );
};

export { AuthProvider, useAuth };