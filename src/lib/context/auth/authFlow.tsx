'use client'

import React, { useCallback, useContext, useState } from "react";

export type AuthFlowPages = "Login" | "ForgotPassword" | "ResetPassword" | "PasswordReset" | "Signup" | "VerifyEmail";


const initialValues: {
    authFlowPage: AuthFlowPages,
    updateAuthFlowPage: (page: AuthFlowPages) => void,
} = {
    authFlowPage: "Login",
    updateAuthFlowPage: (page: AuthFlowPages) => { },
};

type Props = {
    children?: React.ReactNode;
};

const AuthFlowContext = React.createContext(initialValues);

const useAuthFlow = () => useContext(AuthFlowContext);

const AuthFlowProvider: React.FC<Props> = ({ children }) => {

    const [authFlowPage, setAuthFlowPage] = useState<AuthFlowPages>("Login");

    const updateAuthFlowPage = useCallback(
        async (page: AuthFlowPages) => {
            setAuthFlowPage(page);
        }, [],
    );

    return (
        <AuthFlowContext.Provider
            value={{
                authFlowPage,
                updateAuthFlowPage,
            }}
        >
            {children}
        </AuthFlowContext.Provider>
    );
};

export { AuthFlowProvider, useAuthFlow };

