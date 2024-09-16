import { UserResetPasswordForm } from "@/modules/account/components/form"
import { useAuthFlow } from '@/lib/context/auth'
import { AuthBox } from '@/modules/account/components/box'
import KeySVG from '@/assets/icons/key'
import { COUNTDOWN_DURATION } from '@/lib/utils'
import { Progress } from '@/modules/ui/progress'

export const ResetPasswordTemplatePage = () => {


    const { countdown, updateAuthFlowPage, email } = useAuthFlow();

    return (
        <div className="min-w-[320px] relative min-h-screen flex items-center justify-center ">
            <AuthBox
                icon={<KeySVG />}
                description={`Your new password for ${email} must be different from your previously used passwords.`}
                form={<UserResetPasswordForm />}
                title='Set new password?'
                bottom={
                    <>
                        {countdown > 0 ? (
                            <div className="w-full space-y-2">
                                <Progress value={(countdown / COUNTDOWN_DURATION) * 100} className='h-1' />
                                <p className="text-sm text-center text-gray-500">
                                    Resend will be available in {countdown} seconds {" "}<span className="underline text-primary/80 cursor-pointer select-none hover:text-primary duration-300"
                                        onClick={() => {
                                            updateAuthFlowPage("ForgotPassword")
                                        }}>
                                        go back
                                    </span>
                                </p>
                            </div>
                        ) :
                            <div className="flex flex-col text-center text-sm font-medium gap-3">
                                <p className='text-[#475467]'>
                                    Didn’t receive the email?{" "}
                                    <span className="underline text-primary/80 cursor-pointer select-none hover:text-primary duration-300"
                                        onClick={() => {
                                            updateAuthFlowPage("ForgotPassword")
                                        }}
                                    >
                                        Click here to resend
                                    </span>
                                </p>
                            </div>}

                    </>
                }
            />
        </div>
    )
}