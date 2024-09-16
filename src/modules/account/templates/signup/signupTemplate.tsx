
import { useAuthFlow } from '@/lib/context/auth'
import { AuthBox } from '@/modules/account/components/box'
import { UserSignupAuthForm } from "@/modules/account/components/form"

export const SignupTemplatePage = () => {
    const { updateAuthFlowPage } = useAuthFlow()

    return (
        <div className="min-w-[320px] relative min-h-screen flex items-center justify-center ">
            <AuthBox
                description='Welcome back! Please enter your details.'
                form={<UserSignupAuthForm />}
                title='Log in to your account'
                bottom={
                    <div className="flex flex-col text-center text-sm font-medium gap-3">
                        <p className='text-[#475467]'>
                            Already have an account?{" "}
                            <span className="underline text-primary/80 cursor-pointer select-none hover:text-primary duration-300"
                                onClick={() => {
                                    updateAuthFlowPage("Login")
                                }}
                            >
                                Login
                            </span>
                        </p>
                    </div>
                }
            />
        </div>
    )
}