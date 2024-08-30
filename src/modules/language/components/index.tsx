'use client'

import { translator } from '@/lib/lang/translator'
import React, { useState } from 'react'


export interface LanguageTranslatorProps
    extends React.HTMLAttributes<HTMLDivElement> { }



export const LanguageTranslator = ({ className, children, ...props }: LanguageTranslatorProps) => {
    const [data, setData] = useState(translator({
        key: children ? children.toString() : "",
        langCode: "en"
    }))

    if (data)
        return (
            <>
                {data.translation}
            </>
        )
    else return <>{children}</>
}
