'use client'

import React, { useCallback, useContext, useState } from "react";

import { ProfileType } from '@/types/profile';
import { findProfileByUserIdAction } from '@/lib/data/profile/fetchByUserId';


const initialValues: {
    profile: ProfileType | null,
    loading: boolean,
    error: boolean,
    fetchProfile: (id: string) => Promise<ProfileType | null>,
    setProfile: (profile: ProfileType) => void,
} = {
    profile: null,
    loading: true,
    error: false,
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
    const [error, setError] = useState(false);
    const [profile, setProfile] = useState<ProfileType | null>(null)

    const fetchProfile = useCallback(
        async (id: string): Promise<ProfileType | null> => {
            setLoading(true);
            setError(false);
            try {
                let value = await findProfileByUserIdAction(id);
                setProfile(value)
                setLoading(false);
                return value

            } catch (e) {
                console.error(e)
                setLoading(false);
                setError(true)
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
                loading,
                error
            }}
        >
            {children}
        </ProfileContext.Provider>
    );
};

export { ProfileProvider, useProfile };