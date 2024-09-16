'use client'

import { ResetPasswordEmailAction } from '@/lib/data/account/resetPassword';
import { signInWithPasswordAction } from '@/lib/data/account/signIn';
import { signUpAction } from '@/lib/data/account/signUp';
import { updatePasswordAction } from '@/lib/data/account/updatePassword';
import { verifyEmailAction } from '@/lib/data/account/verify';
import React, { useCallback, useContext, useEffect, useState } from "react";

export type AuthFlowPages = "Login" | "ForgotPassword" | "ResetPassword" | "PasswordReset" | "Signup" | "VerifyEmail";


const initialValues: {
    authFlowPage: AuthFlowPages,
    updateAuthFlowPage: (page: AuthFlowPages) => void,

    countdown: number,
    setCountdown: (index: number) => void

    email: string | null,
    setEmail: (index: string) => void,


    signup: ({ fullName, email, password }: { fullName: string, email: string, password: string }) => void,
    login: ({ email, password }: { email: string, password: string }) => void,
    resetPasswordEmail: (email: string) => void
    resetPassword: ({ }: { email: string, token: string, password: string }) => void,
    verifyEmail: ({ }: { token: string, email: string }) => void,
} = {
    authFlowPage: "Login",
    updateAuthFlowPage: (page: AuthFlowPages) => { },

    countdown: 0,
    setCountdown: (index: number) => { },

    email: null,
    setEmail: (index: string) => { },



    signup: ({ }: { fullName: string, email: string, password: string }) => { },
    login: ({ }: { email: string, password: string }) => { },
    resetPasswordEmail: (email: string) => { },
    resetPassword: ({ }: { email: string, token: string, password: string }) => { },
    verifyEmail: ({ }: { token: string, email: string }) => { },
};

type Props = {
    children?: React.ReactNode;
};

const AuthFlowContext = React.createContext(initialValues);

const useAuthFlow = () => useContext(AuthFlowContext);


const COUNTDOWN_DURATION = 60 // 60 seconds

const AuthFlowProvider: React.FC<Props> = ({ children }) => {

    const [authFlowPage, setAuthFlowPage] = useState<AuthFlowPages>("Login");

    const [email, setEmail] = useState<string | null>(null)
    const [countdown, setCountdown] = useState(0)


    const updateAuthFlowPage = useCallback(
        async (page: AuthFlowPages) => {
            setAuthFlowPage(page);
        }, [],
    );

    // countdown setter and fetcher
    useEffect(() => {
        const storedTimestamp = localStorage.getItem('resetPasswordCountdown')
        if (storedTimestamp) {
            const remainingTime = COUNTDOWN_DURATION - Math.floor((Date.now() - parseInt(storedTimestamp)) / 1000)
            if (remainingTime > 0) {
                setCountdown(remainingTime)
            } else {
                localStorage.removeItem('resetPasswordCountdown')
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    useEffect(() => {
        const storedTimestamp = localStorage.getItem('resetPasswordCountdown')
        let countdownData = countdown;
        if (storedTimestamp && email) {
            const data = JSON.parse(storedTimestamp);
            if (data[email] && data[email].date) {
                countdownData = COUNTDOWN_DURATION - Math.floor((Date.now() - parseInt(data[email].date)) / 1000)
            }
        }

        if (countdownData > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
            return () => clearTimeout(timer)
        } else {
            localStorage.removeItem('resetPasswordCountdown')
        }
    }, [countdown, setCountdown])

    ///-----------------------------------------------------/////



    const startCountdown = () => {
        setCountdown(COUNTDOWN_DURATION)
        if (email)
            localStorage.setItem('resetPasswordCountdown', JSON.stringify({
                email: {
                    email: email,
                    date: Date.now().toString()
                }
            }))
    }




    const signup = useCallback(
        async ({ fullName, email, password }: { fullName: string, email: string, password: string }) => {
            try {
                let user = await signUpAction({
                    name: fullName,
                    email,
                    password,
                });
                startCountdown()
                return user
            } catch (e) {
                console.error(e)
                throw new Error("error")
            }
        },
        [],
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
        [],
    );



    const resetPassword = useCallback(
        async ({ email, token, password }: { email: string, token: string, password: string }) => {
            try {
                const response = await updatePasswordAction(
                    {
                        email,
                        token,
                        password
                    }
                );

            } catch (e) {
                console.error(e)
                throw new Error("error")
            }
        },
        [],
    );


    const verifyEmail = useCallback(
        async ({ token, email }: { token: string, email: string }) => {
            try {

                const response = verifyEmailAction(
                    {
                        email,
                        token
                    }
                );

                return response;
            } catch (e) {
                console.error(e)
                throw new Error("error")
            }
        },
        [],
    );

    const resetPasswordEmail = async (email: string) => {
        if (countdown <= 0) {
            try {
                const response = await ResetPasswordEmailAction(email);
                startCountdown()
            } catch (e) {
                throw new Error(`${e}`)
            }

        }
    }

    return (
        <AuthFlowContext.Provider
            value={{
                authFlowPage,
                updateAuthFlowPage,
                countdown,
                setCountdown,
                email,
                setEmail,
                resetPasswordEmail,
                login,
                signup,
                resetPassword,
                verifyEmail,
            }}
        >
            {children}
        </AuthFlowContext.Provider>
    );
};

export { AuthFlowProvider, useAuthFlow };

