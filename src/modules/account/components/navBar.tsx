import React from 'react'

import { AvatarSection } from '@/modules/layout/components';
import LogoSVG from '@/assets/icons/logo';
import { Button } from '@/modules/ui/button';
import { useOnboarding } from '@/lib/context/account/onboarding';



export const OnboardingNavBar = () => {

    const { onBoardingId, onBoardingSubSet, setOnBoardingId, setOnBoardingSubSet } = useOnboarding();

    return (
        <div className='screen-parent min-h-14 h-[8vh] max-h-20 fixed z-30'>
            <header
                className="border-b top-0 flex justify-between items-center w-full gap-4 sm:sticky bg-background sm:h-auto sm:border-b-[1px] py-3 screen-padding">
                <div className='flex gap-5'>
                    <LogoSVG />
                    {onBoardingId + onBoardingSubSet > 0 && <Button variant={"secondary"}
                        onClick={() => {
                            if (onBoardingSubSet > 0)
                                setOnBoardingSubSet(onBoardingSubSet - 1)
                            else if (onBoardingId > 0)
                                setOnBoardingId(onBoardingId - 1)
                        }}

                    >
                        Back
                    </Button>}
                </div>
                <AvatarSection />
            </header>
        </div>
    )
}
