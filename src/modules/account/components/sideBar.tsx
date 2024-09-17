import CheckSVG from '@/assets/icons/check'
import LogoSVG from '@/assets/icons/logo'
import { onBoardingSteps, useOnboarding } from '@/lib/context/account/onboarding'
import { Button } from '@/modules/ui/button'
import { Card, CardContent } from '@/modules/ui/card'
import React from 'react'


export const OnboardingSideBar = () => {

    const { onBoardingId, onBoardingSubSet, setOnBoardingId, setOnBoardingSubSet } = useOnboarding()
    return (
        <Card className="w-full md:w-96 rounded-lg md:fixed">
            <CardContent className='p-6 flex flex-col gap-2 select-none'>
                {onBoardingSteps.map((step, index) => (
                    <div key={index} >
                        <Button
                            onClick={() => {
                                if (index < onBoardingId)
                                    setOnBoardingId(index)
                            }}
                            className={`w-full text-left flex justify-between min-h-9  ${onBoardingId === index ? 'bg-secondary hover:bg-secondary' : 'bg-transparent hover:bg-transparent'} px-4 py-2 rounded`}
                        >
                            <span className={`font-medium text-black text-sm`}>
                                {index + 1}. {step.title}
                            </span>
                            {index < onBoardingId && < CheckSVG />}
                        </Button>
                        <div className='flex flex-col'>
                            {step.subSteps.map((subStep, subSetIndex) => (
                                <div key={index}
                                    onClick={() => {
                                        if (index === onBoardingId && subSetIndex < onBoardingSubSet)
                                            setOnBoardingSubSet(subSetIndex)
                                    }}
                                    className={`
                                    ml-[32px] mt-1 
                                    text-sm text-foreground 
                                    ${onBoardingId === index && onBoardingSubSet === subSetIndex ? 'font-semibold' : ''}
                                    ${index === onBoardingId && subSetIndex < onBoardingSubSet ? 'cursor-pointer' : ''}
                                    h-7
                                    `}>
                                    {subStep}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
