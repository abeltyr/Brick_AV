import { UserLoginAuthForm } from "@/modules/account/components/form/userLoginAuthForm"
import { useAuthFlow } from '@/lib/context/auth'
import { AuthBox } from '@/modules/account/components/box'
import KeySVG from '@/assets/icons/key'

export const ResetPasswordTemplatePage = () => {
    const { updateAuthFlowPage } = useAuthFlow()

    return (
        <div className="min-w-[320px] relative min-h-screen flex items-center justify-center ">
            <AuthBox
                icon={<KeySVG />}
                description='Your new password must be different to \n previously used passwords.'
                form={<UserLoginAuthForm />}
                title='Set new password?'
                bottom={
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
                }
            />
        </div>
    )
}