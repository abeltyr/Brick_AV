'use client'

import { OnboardingNavBar } from '@/modules/account/components/navBar'
import { OnboardingSideBar } from '@/modules/account/components/sideBar'
import { Separator } from '@/modules/ui/separator'
import { onBoardingSteps, useOnboarding } from '@/lib/context/account/onboarding'
import { memo, useEffect, useState } from 'react'

const OnboardingPage = () => {

    const { onBoardingId, onBoardingSubSet } = useOnboarding()
    const [onboardingState, setOnBoardingState] = useState(onBoardingSteps[1])
    const [onboardingInnerState, setOnBoardingInnerState] = useState(onBoardingSteps[1].subSteps[1])

    useEffect(() => {
        if (!(onBoardingSteps.length <= onBoardingId)) {
            const value = onBoardingSteps[onBoardingId];
            setOnBoardingState(value);

            if (!(value.subSteps.length <= onBoardingSubSet)) {
                const value = onBoardingSteps[onBoardingId].subSteps[onBoardingSubSet];
                setOnBoardingInnerState(value);
            }

        }
    }, [onBoardingId, onBoardingSubSet])


    return (
        <div className="min-h-screen ">
            <OnboardingNavBar />

            <div className='h-[8vh] max-h-20 w-full' />
            <div className="screen-parent">
                <div className='screen-padding pt-10'>

                    <div className="flex flex-col md:flex-row gap-16">
                        <div className='w-full md:w-96 relative h-full'>
                            <OnboardingSideBar />
                        </div>

                        <main className="flex-1">
                            <div className='flex flex-col'>
                                <h1 className="text-lg font-semiBold">{onboardingState.title}</h1>
                                <p className="text-gray-500 text-sm">{onboardingState.description}</p>
                                <Separator className='my-6' />
                            </div>
                            <p className='text-lg font-semibold mb-4'>
                                {onboardingInnerState.name}
                            </p>
                            {onboardingInnerState.form}
                        </main>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default memo(OnboardingPage)