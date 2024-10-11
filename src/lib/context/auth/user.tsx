'use client'

import React, { useCallback, useContext, useEffect, useState } from "react";
import { Session } from '@supabase/supabase-js';
import { createClient } from '@/lib/utils/supabase/client';
import { getUserAction, refreshAccountToken } from '@/lib/data/account/fetch';
import { logoutAction } from '@/lib/data/account/logout';
import LoadingTemplate from '@/modules/common/templates/loading';


const initialValues: {
    session: Session | null,
    loading: boolean,
    error: boolean,
    logout: () => void,
    fetchUser: () => void,
} = {
    session: null,
    loading: true,
    error: true,
    logout: () => { },
    fetchUser: () => { },
};

type Props = {
    children?: React.ReactNode;
};

const AuthContext = React.createContext(initialValues);

const useAuth = () => useContext(AuthContext);

const AuthProvider: React.FC<Props> = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [session, setSession] = useState<Session | null>(null)

    const fetchUser = useCallback(
        async () => {
            setLoading(true);
            setError(false);
            try {
                await getUserAction();
                setLoading(false);
            } catch (e) {
                console.error(e)
                setLoading(false);
                setError(true)
            }
        },
        [],
    );

    const logout = useCallback(
        async () => {
            try {
                await logoutAction();
                setSession(null);
                localStorage.clear();
                window.location.reload();
            } catch (e) {
                console.error(e)
            }
        },
        [],
    );

    const refreshAccountSession = useCallback(
        async () => {
            setLoading(true);
            setError(false);
            try {
                const data = await refreshAccountToken();
                setSession(data.session);
                setLoading(false);
            } catch (e) {
                // await logout();
                setSession(null);
                setError(true)
                setLoading(false);
            }
        },
        [],
    );

    useEffect(() => {
        // console.log("refreshAccountSession dataSetter useEffect")
        const dataSetter = async () => {
            const supabase = createClient();
            const { data } = await supabase.auth.getSession();
            setSession(data.session)
            setLoading(false);
        }
        dataSetter()
    }, [])


    useEffect(() => {
        // console.log("subscription useEffect")
        const supabase = createClient();

        const { data: { subscription }, } = supabase.auth.onAuthStateChange(
            async (_event, session: Session | null) => {
                if (session) {
                    const expiresAt = session.expires_at
                    const currentTime = Math.floor(Date.now() / 1000) // convert to Unix timestamp
                    if (expiresAt && expiresAt - currentTime < 300) {
                        await refreshAccountSession();
                    }
                    setError(false)
                    setSession(session)
                    setLoading(false);
                } else {
                    setSession(null)
                    setLoading(false);
                }
            }
        )

        return () => subscription.unsubscribe()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    if (loading)
        return <>
            <p className='text-3xl font-black text-black'>
                Auth Loading
            </p>
            <LoadingTemplate />
        </>
    else if (!loading && error)
        return <>
            <p className='text-3xl font-black text-black'>
                Auth Error Page
            </p>
            <LoadingTemplate />
        </>
    else
        return (
            <AuthContext.Provider
                value={{
                    session,
                    fetchUser,
                    logout,
                    loading,
                    error
                }}
            >
                {children}
            </AuthContext.Provider>
        );
};

export { AuthProvider, useAuth };