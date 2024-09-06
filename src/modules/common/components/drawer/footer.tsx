import React from 'react'
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { LanguageTranslator } from '@/modules/language/components'
import { Button } from '@/modules/ui/button'
import LoadingSVG from '@/assets/icons/loading'


export const DrawerSheetFooter = ({
    disabled = false,
    isLoading, createSVG, cancelSVG, create = "Create", cancel = "Cancel", createFunction, closeFunction }: {
        isLoading: boolean,
        createSVG: React.JSX.Element,
        cancelSVG?: React.JSX.Element,
        create?: string,
        cancel?: string
        createFunction?: Function
        closeFunction?: Function
        disabled?: boolean
    }) => {
    return (
        <div className='left-0 right-0 px-6 bottom-0 py-3 absolute flex justify-end gap-6 bg-background/90'>
            <div className="rounded-full transition-colors text-foreground/70 duration-300 hover:text-foreground">
                <Button className='flex gap-2 p-x4 py-2'
                    variant={"secondary"}
                    onClick={(e) => {
                        if (closeFunction) closeFunction(e)
                    }}
                >
                    {cancelSVG}
                    <LanguageTranslator>
                        {cancel}
                    </LanguageTranslator>
                </Button>
            </div>

            <Button
                disabled={isLoading || disabled}
                className='flex gap-2 p-x4 py-2'
                onClick={() => {
                    if (createFunction) createFunction();
                }}
            >
                {isLoading ? (
                    <div className='h-5 w-5 animate-spin'>
                        <LoadingSVG />
                    </div>
                ) : createSVG}

                <LanguageTranslator>
                    {create}
                </LanguageTranslator>

            </Button>
        </div>

    )
}
