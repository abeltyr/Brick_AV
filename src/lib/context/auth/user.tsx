'use client'

import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { getUserAction, logoutAction, refreshAccountToken, signInWithPasswordAction } from '@/lib/data/account';
import { Session } from '@supabase/supabase-js';
import { createClient } from '@/lib/utils/supabase/client';


const initialValues: {
    session: Session | null,
    loading: boolean,
    login: ({ email, password }: { email: string, password: string }) => void,
    logout: () => void,
    fetchUser: () => void,
    updateUser: ({ }: {}) => void,
} = {
    session: null,
    loading: true,
    login: ({ email, password }: { email: string, password: string }) => { },
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
    const [session, setSession] = useState<Session | null>(null)


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
        } = supabase.auth.onAuthStateChange((_event, session: any) => {
            if (session) {
                const expiresAt = session.expires_at
                const currentTime = Math.floor(Date.now() / 1000) // convert to Unix timestamp
                if (expiresAt - currentTime < 300) {
                    refreshAccountSession();
                }
            }
            setSession(session)
        })

        return () => subscription.unsubscribe()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])



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
                if (value)
                    return value.user;
            } catch (e) {
                console.error(e)
            }
            setLoading(false);
        },
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




    return (
        <AuthContext.Provider
            value={{
                session,
                fetchUser,
                login,
                logout: logout,
                updateUser: () => { },
                loading
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export { AuthProvider, useAuth };