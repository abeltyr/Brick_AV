'use client';

import { useAuthFlow } from '@/lib/context/auth';
import { SignupTemplatePage, VerifyEmailTemplatePage } from './signup/';
import { ForgotPasswordTemplatePage, LoginTemplatePage, PasswordResetTemplatePage, ResetPasswordTemplatePage } from './login';

export default function AuthenticationPage() {
    const { authFlowPage } = useAuthFlow()

    switch (authFlowPage) {
        case "Signup":
            return <SignupTemplatePage />
        case "VerifyEmail":
            return <VerifyEmailTemplatePage />
        case "Login":
            return <LoginTemplatePage />
        case "ForgotPassword":
            return <ForgotPasswordTemplatePage />
        case "ResetPassword":
            return <ResetPasswordTemplatePage />
        case "PasswordReset":
            return <PasswordResetTemplatePage />
        default:
            return <LoginTemplatePage />
    }

}