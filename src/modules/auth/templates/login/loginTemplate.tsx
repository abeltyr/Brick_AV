import { UserLoginAuthForm } from "@/modules/auth/components/form"
import { useAuthFlow } from '@/lib/context/auth'
import { AuthBox } from '@/modules/auth/components/box'

export const LoginTemplatePage = () => {
    const { updateAuthFlowPage } = useAuthFlow()

    return (
        <div className="min-w-[320px] relative min-h-screen flex items-center justify-center ">
            <AuthBox
                description='Welcome back! Please enter your details.'
                form={<UserLoginAuthForm />}
                title='Log in to your account'
                bottom={
                    <div className="flex flex-col text-center text-sm font-medium gap-3">
                        <p className='text-[#475467]'>
                            Don’t have an account?{" "}
                            <span className="underline text-primary/80 cursor-pointer select-none hover:text-primary duration-300"
                                onClick={() => {
                                    updateAuthFlowPage("Signup")
                                }}
                            >
                                Sign up
                            </span>
                        </p>
                        <p className="underline text-primary/80 cursor-pointer select-none hover:text-primary duration-300"
                            onClick={() => {
                                updateAuthFlowPage("ForgotPassword")
                            }}
                        >
                            Forget Password
                        </p>

                    </div>
                }
            />
        </div>
    )
}