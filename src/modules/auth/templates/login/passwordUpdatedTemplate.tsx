import { AuthBox } from '@/modules/auth/components/box'
import ShiedCheckSVG from '@/assets/icons/shiedCheck'
import { Button } from '@/modules/ui/button'
import { useRouter } from 'next/navigation'

export const PasswordUpdatedTemplatePage = () => {

    return (
        <div className="min-w-[320px] relative min-h-screen flex items-center justify-center ">
            <AuthBox
                icon={<ShiedCheckSVG />}
                description='Your password has been successfully reset. Click below to log in magically.'
                form={< ></>}
                title='Password reset'
                bottom={
                    <div className="flex flex-col text-center text-sm font-medium gap-3">
                        <Button onClick={() => {
                            window.location.reload();
                        }}>
                            Log in
                        </Button>
                    </div>
                }
            />
        </div>
    )
}
