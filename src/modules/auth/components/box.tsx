import LogoSVG from '@/assets/icons/logo'
import React from 'react'

export const AuthBox = ({
    icon,
    bottom: Bottom,
    description,
    form: FormData,
    title
}: {
    icon?: JSX.Element,
    title: string,
    description: string,
    form: JSX.Element,
    bottom: JSX.Element,
}) => {
    return (
        <div className="max-w-[520px] border-[1px] border-gray-200 p-8 rounded-lg flex flex-col justify-start items-center gap-6">
            {icon ? icon : <LogoSVG />}
            <div className="mx-auto flex flex-col justify-center gap-6 w-full sm:w-[350px]">
                <div className="flex flex-col gap-2 text-center">
                    <h1 className="text-3xl font-semibold tracking-tight">
                        {title}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {description}
                    </p>
                </div>
                {FormData}
                {Bottom}
            </div>
        </div>
    )
}
