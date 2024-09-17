'use client'

import React, { useContext, useState } from "react";


export const onBoardingSteps = [
    {
        title: 'Create your account',
        subSteps: ['Profile', 'Address',]
    },
    {
        title: 'Create a company',
        subSteps: ['Company detail', 'Business',]
    },
    {
        title: 'Create owner info',
        subSteps: ['Role', 'Profile', 'Address',]
    },
]



const initialValues: {
    onBoardingId: number,
    setOnBoardingId: (index: number) => void,
    onBoardingSubSet: number,
    setOnBoardingSubSet: (index: number) => void,
} = {
    onBoardingId: 0,
    setOnBoardingId: (index: number) => { },
    onBoardingSubSet: 0,
    setOnBoardingSubSet: (index: number) => { },
};

type Props = {
    children?: React.ReactNode;
};

const OnboardingContext = React.createContext(initialValues);

const useOnboarding = () => useContext(OnboardingContext);

const OnboardingProvider: React.FC<Props> = ({ children }) => {
    const [onBoardingId, setOnBoardingId] = useState(0);
    const [onBoardingSubSet, setOnBoardingSubSet] = useState(0);


    return (
        <OnboardingContext.Provider
            value={{
                onBoardingId,
                setOnBoardingId,
                onBoardingSubSet,
                setOnBoardingSubSet
            }}
        >
            {children}
        </OnboardingContext.Provider>
    );
};

export { OnboardingProvider, useOnboarding };