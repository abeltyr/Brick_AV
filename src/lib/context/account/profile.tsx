'use client'

import React, { useCallback, useContext, useState } from "react";

import { ProfileType } from '@/types/profile';
import { findProfileByIdAction } from '@/lib/data/profile/fetchById';
import { CompanyType } from '@/types/company';


const initialValues: {
    profile: ProfileType | null,
    loading: boolean,
    fetchProfile: (id: string) => Promise<ProfileType | null>,
} = {
    profile: null,
    loading: true,
    fetchProfile: async (id: string) => { return null }
};

type Props = {
    children?: React.ReactNode;
};

const ProfileContext = React.createContext(initialValues);

const useProfile = () => useContext(ProfileContext);

const ProfileProvider: React.FC<Props> = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<ProfileType | null>(null)
    const [company, setCompany] = useState<CompanyType | null>(null)
    const [onboarding, setOnboarding] = useState<boolean>(true)

    const fetchProfile = useCallback(
        async (id: string): Promise<ProfileType | null> => {
            setLoading(true);
            console.log("data value")
            try {
                let value = await findProfileByIdAction(id);
                setProfile(value)
                setLoading(false);
                return value
            } catch (e) {
                console.error(e)
                setLoading(false);
                return null
            }
        },
        [],
    );


    return (
        <ProfileContext.Provider
            value={{
                profile,
                fetchProfile,
                loading
            }}
        >
            {children}
        </ProfileContext.Provider>
    );
};

export { ProfileProvider, useProfile };