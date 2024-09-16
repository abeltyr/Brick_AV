
import { useAuthFlow } from '@/lib/context/auth'
import { COUNTDOWN_DURATION } from '@/lib/utils'
import { AuthBox } from '@/modules/account/components/box'
import { UserSignupAuthForm } from "@/modules/account/components/form"
import { Progress } from '@/modules/ui/progress'

export const SignupTemplatePage = () => {
    const { updateAuthFlowPage, countdown } = useAuthFlow()

    return (
        <div className="min-w-[320px] relative min-h-screen flex items-center justify-center ">
            <AuthBox
                description='Welcome back! Please enter your details.'
                form={<UserSignupAuthForm />}
                title='Log in to your account'
                bottom={

                    <>
                        <div className='flex flex-col gap-2'>

                            {countdown > 0 && (
                                <div className="w-full space-y-2">
                                    <Progress value={(countdown / COUNTDOWN_DURATION) * 100} className='h-1 w-full' />
                                    <p className="text-sm text-center text-gray-500">
                                        Wait {countdown} seconds before retrying. The option is temporarily disabled.
                                    </p>
                                </div>
                            )}
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


                        </div>
                    </>
                }
            />
        </div>
    )
}