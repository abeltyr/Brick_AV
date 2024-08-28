import { translator } from '@/lib/lang/translator'
import React from 'react'


export interface LanguageTranslatorProps
    extends React.HTMLAttributes<HTMLDivElement> { }



export const LanguageTranslator = ({ className, children, ...props }: LanguageTranslatorProps) => {
    return (
        <>
            {translator({
                key: children ? children.toString() : "",
                langCode: "en"
            })?.translation}
        </>
    )
}
