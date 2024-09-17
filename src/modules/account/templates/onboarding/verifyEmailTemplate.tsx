


import EmailSVG from '@/assets/icons/email'
import { useAuthFlow } from '@/lib/context/auth'
import { COUNTDOWN_DURATION } from '@/lib/utils'
import { AuthBox } from '@/modules/auth/components/box'
import { UserEmailVerificationForm } from "@/modules/auth/components/form"
import { Progress } from '@/modules/ui/progress'

export const VerifyEmailTemplatePage = () => {
    const { updateAuthFlowPage, email, countdown } = useAuthFlow()

    return (
        <div className="min-w-[320px] relative min-h-screen flex items-center justify-center ">
            <AuthBox
                icon={<EmailSVG />}
                description={`We sent a password reset link to ${email}`}
                form={<UserEmailVerificationForm />}
                title='Check your email'
                bottom={
                    <>
                        {countdown > 0 ? (
                            <div className="w-full space-y-2">
                                <Progress value={(countdown / COUNTDOWN_DURATION) * 100} className='h-1' />
                                <p className="text-sm text-center text-gray-500">
                                    Resend will be available in {countdown} seconds {" "}<span className="underline text-primary/80 cursor-pointer select-none hover:text-primary duration-300"
                                        onClick={() => {
                                            updateAuthFlowPage("Signup")
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
                                            updateAuthFlowPage("Signup")
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