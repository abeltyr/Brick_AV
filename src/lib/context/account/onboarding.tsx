'use client'

import { fetchBusinessApi } from '@/lib/data/business/create';
import { onBoardingAction } from '@/lib/data/user/create';
import { addressSchema, companyInTakeSchema, companySchema, ownerSchema, profileSchema } from '@/lib/form/account';
import { OnboardingAddressForm, OnboardingCompanyForm, OnboardingCompanyInTakeForm, OnboardingOwnerAddressForm, OnboardingOwnerForm, OnboardingProfileForm } from '@/modules/account/components/form';
import { BusinessType } from '@/types/business';
import { ProfileInputType, ProfileType } from '@/types/profile';
import React, { useContext, useState } from "react";
import { z } from 'zod';

export const onBoardingSteps = [
    {
        title: 'Create your profile',
        description: "This will be your profile linked to all your activity",
        subSteps: [{
            name: 'Profile',
            form: <OnboardingProfileForm />
        }, {
            name: 'Address',
            form: <OnboardingAddressForm />
        }]
    },
    {
        title: 'Create a company',
        description: "This will be one of the company for which all the. ",
        subSteps: [{
            name: 'Company detail',
            form: <OnboardingCompanyInTakeForm />
        }, {
            name: 'Business',
            form: <OnboardingCompanyForm />
        }]
    },
    {
        title: 'Create owner info',
        description: "We require the owner detail, if this your self no need to reenter but if not please provide, it bellow so that we can link it to there account.",
        subSteps: [{
            name: 'Profile',
            form: <OnboardingOwnerForm />
        }, {
            name: 'Address',
            form: <OnboardingOwnerAddressForm />
        }]
    },
]



const initialValues: {
    onBoardingId: number,
    setOnBoardingId: (index: number) => void,
    onBoardingSubSet: number,
    setOnBoardingSubSet: (index: number) => void,
    profile: z.infer<typeof profileSchema> | null,
    setProfile: (profile: z.infer<typeof profileSchema> | null) => void,
    address: z.infer<typeof addressSchema> | null,
    setAddress: (address: z.infer<typeof addressSchema> | null) => void,
    companyIntake: z.infer<typeof companyInTakeSchema> | null,
    setCompanyIntake: (companyIntake: z.infer<typeof companyInTakeSchema> | null) => void,
    business: BusinessType | null,
    setBusiness: (business: BusinessType | null) => void,
    company: z.infer<typeof companySchema> | null,
    setCompany: (company: z.infer<typeof companySchema> | null) => void,
    owner: z.infer<typeof ownerSchema> | null,
    setOwner: (owner: z.infer<typeof ownerSchema> | null) => void,
    ownerAddress: z.infer<typeof addressSchema> | null,
    setOwnerAddress: (ownerAddress: z.infer<typeof addressSchema> | null) => void,
    ownerProfile: z.infer<typeof profileSchema> | null,
    setOwnerProfile: (ownerProfile: z.infer<typeof profileSchema> | null) => void,
    fetchBusiness: (tinNumber: string) => Promise<BusinessType | null>
    createUser: ({ ownerAddressData, userId }: { ownerAddressData?: z.infer<typeof addressSchema>, userId: string }) => Promise<ProfileType | null>
} = {
    onBoardingId: 0,
    setOnBoardingId: (index: number) => { },
    onBoardingSubSet: 0,
    setOnBoardingSubSet: (index: number) => { },
    profile: null,
    setProfile: (profile) => { },
    address: null,
    setAddress: (address) => { },
    companyIntake: null,
    setCompanyIntake: (companyIntake) => { },
    business: null,
    setBusiness: (business) => { },
    company: null,
    setCompany: (company) => { },
    owner: null,
    setOwner: (owner) => { },
    ownerAddress: null,
    setOwnerAddress: (ownerAddress) => { },
    ownerProfile: null,
    setOwnerProfile: (ownerProfile) => { },
    createUser: async ({ ownerAddressData, userId }: { ownerAddressData?: z.infer<typeof addressSchema>, userId: string }) => { return null },
    fetchBusiness: async (tinNumber: string) => { return null }
};

type Props = {
    children?: React.ReactNode;
};

const OnboardingContext = React.createContext(initialValues);

const useOnboarding = () => useContext(OnboardingContext);

const OnboardingProvider: React.FC<Props> = ({ children }) => {
    const [onBoardingId, setOnBoardingId] = useState(0);
    const [onBoardingSubSet, setOnBoardingSubSet] = useState(0);
    const [profile, setProfile] = useState<z.infer<typeof profileSchema> | null>(
        //     {
        //     phoneNumber: "911223989",
        //     dateOfBirth: {
        //         day: "10",
        //         month: "10",
        //         year: "2000"
        //     },
        //     fullName: "",
        //     email: "",
        //     gender: "male"
        // }
        null
    );
    const [address, setAddress] = useState<z.infer<typeof addressSchema> | null>(
        //     {
        //     houseNumber: "new",
        //     region: "addis_ababa",
        //     woreda: "Lideta",
        //     zone: "Addis ababa",
        //     description: "",
        //     kebele: "10"
        // }

        null
    );
    const [companyIntake, setCompanyIntake] = useState<z.infer<typeof companyInTakeSchema> | null>(
        //     {
        //     companyName: "Ethio Tel",
        //     isRegistered: "yes",
        //     "tinNumber": "0000030603"
        // }

        null
    );
    const [business, setBusiness] = useState<BusinessType | null>(null);
    const [company, setCompany] = useState<z.infer<typeof companySchema> | null>(null);
    const [owner, setOwner] = useState<z.infer<typeof ownerSchema> | null>({
        role: "owner",
        detail: ""
    });
    const [ownerProfile, setOwnerProfile] = useState<z.infer<typeof profileSchema> | null>(null);
    const [ownerAddress, setOwnerAddress] = useState<z.infer<typeof addressSchema> | null>(null);



    const createUser = async ({ ownerAddressData, userId }: { ownerAddressData?: z.infer<typeof addressSchema>, userId: string }): Promise<ProfileType> => {
        if (!business) throw new Error("Business has not been setup")
        if (!owner) throw new Error("Role has not been setup")
        if (!address) throw new Error("Address has not been setup")
        if (!company) throw new Error("company has not been setup")
        if (!companyIntake) throw new Error("companyIntake has not been setup")
        if (!profile) throw new Error("profile has not been setup")

        let ownerProfileData: ProfileInputType | undefined = undefined
        let dateBirth = undefined
        if (ownerProfile) {
            if (ownerProfile.dateOfBirth && ownerProfile.dateOfBirth.year && ownerProfile?.dateOfBirth.month && ownerProfile?.dateOfBirth.day) {
                dateBirth = new Date(parseInt(ownerProfile.dateOfBirth.year), parseInt(ownerProfile?.dateOfBirth.month) - 1, parseInt(ownerProfile?.dateOfBirth.day))
            }

            ownerProfileData = {
                name: ownerProfile.fullName,
                dateBirth,
                gender: ownerProfile.gender === "male" ? "Male" : "Female",
                phoneNumber: ownerProfile.phoneNumber ?? "",
                tinNumber: ownerProfile.tinNumber ?? "",
                address: {
                    ...ownerAddressData
                }
            }
        }

        let profileInputData: ProfileInputType | undefined = undefined
        let profileDateBirth = undefined

        if (profile.dateOfBirth && profile.dateOfBirth.year && profile?.dateOfBirth.month && profile?.dateOfBirth.day) {
            dateBirth = new Date(parseInt(profile.dateOfBirth.year), parseInt(profile?.dateOfBirth.month) - 1, parseInt(profile?.dateOfBirth.day))
        }

        profileInputData = {
            name: profile.fullName,
            dateBirth: profileDateBirth,
            gender: profile.gender === "male" ? "Male" : "Female",
            phoneNumber: profile.phoneNumber ?? "",
            tinNumber: profile.tinNumber ?? "",
            address: {
                description: address.description,
                houseNumber: address.houseNumber,
                region: address.region,
                woreda: address.woreda,
                zone: address.zone,
                kebele: address.kebele
            }
        }


        try {

            const profileData = await onBoardingAction({
                company: {
                    businessId: business.id,
                    name: companyIntake?.companyName,
                    phoneNumber: company.companyPhone,
                    phoneNumberAlterative: company.companyPhoneAlternative,
                    managerName: company.managerName
                },
                ownerProfile: ownerProfileData,
                role: owner.role,
                roleDetail: owner.detail,
                profile: {
                    userId,
                    ...profileInputData
                }
            })

            return profileData;
        } catch (e) {
            console.log(e)
            throw new Error("e")
        }


    }



    const fetchBusiness = async (tinNumber: string): Promise<BusinessType | null> => {
        try {
            const businessData = await fetchBusinessApi(tinNumber);
            setBusiness(businessData);
            return businessData
        } catch (e: any) {
            console.log(e)
            throw new Error(e)
        }
    }


    return (
        <OnboardingContext.Provider
            value={{
                onBoardingId,
                setOnBoardingId,
                onBoardingSubSet,
                setOnBoardingSubSet,
                address,
                business,
                company,
                companyIntake,
                owner,
                ownerAddress,
                profile,
                setAddress,
                setBusiness,
                setCompany,
                setCompanyIntake,
                setOwner,
                setOwnerAddress,
                setProfile,
                createUser,
                fetchBusiness,
                ownerProfile,
                setOwnerProfile
            }}
        >
            {children}
        </OnboardingContext.Provider>
    );
};

export { OnboardingProvider, useOnboarding };