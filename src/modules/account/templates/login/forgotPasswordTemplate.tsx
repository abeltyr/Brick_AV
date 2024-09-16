import { UserForgotPasswordForm } from "@/modules/account/components/form"
import { useAuthFlow } from '@/lib/context/auth'
import { AuthBox } from '@/modules/account/components/box'
import LockSVG from '@/assets/icons/lock'
import { COUNTDOWN_DURATION } from '@/lib/utils'
import { Progress } from '@/modules/ui/progress'

export const ForgotPasswordTemplatePage = () => {
    const { updateAuthFlowPage, countdown, } = useAuthFlow()

    return (
        <div className="min-w-[320px] relative min-h-screen flex items-center justify-center ">
            <AuthBox
                icon={<LockSVG />}
                description='No worries, we’ll send you reset instructions.'
                form={<UserForgotPasswordForm />}
                title='Forgot password?'
                bottom={
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
                                Remembered your password?{" "}
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
                }
            />
        </div>
    )
}
