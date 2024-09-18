'use client'

import React, { useCallback, useContext, useState } from "react";

import { ProfileType } from '@/types/profile';
import { findProfileByUserIdAction } from '@/lib/data/profile/fetchByUserId';


const initialValues: {
    profile: ProfileType | null,
    loading: boolean,
    fetchProfile: (id: string) => Promise<ProfileType | null>,
    setProfile: (profile: ProfileType) => void
} = {
    profile: null,
    loading: true,
    fetchProfile: async (id: string) => { return null },
    setProfile: (profile) => { }
};

type Props = {
    children?: React.ReactNode;
};

const ProfileContext = React.createContext(initialValues);

const useProfile = () => useContext(ProfileContext);

const ProfileProvider: React.FC<Props> = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<ProfileType | null>(null)

    const fetchProfile = useCallback(
        async (id: string): Promise<ProfileType | null> => {
            setLoading(true);
            try {

                let value = await findProfileByUserIdAction(id);
                console.log("value", value)
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
                setProfile,
                fetchProfile,
                loading
            }}
        >
            {children}
        </ProfileContext.Provider>
    );
};

export { ProfileProvider, useProfile };