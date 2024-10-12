'use client'

import { fetchBusinessApi } from '@/lib/data/business/create';
import { onBoardingAction } from '@/lib/data/user/create';
import { addressSchema, companyInTakeSchema, companySchema, profileSchema } from '@/lib/form/account';
import yearSchema from '@/lib/form/account/accountPeriod';
import { chartOfAccountsSchema } from '@/lib/form/account/chartOfAccount';
import { OnboardingAddressForm, OnboardingCompanyForm, OnboardingCompanyInTakeForm, OnboardingProfileForm } from '@/modules/account/components/form';
import { OnboardingAccountingPeriodForm } from '@/modules/account/components/form/AccountingPeroidForm';
import { OnboardingChartOfAccountForm } from '@/modules/account/components/form/ChartOfAccountsForm';
import { BusinessType } from '@/types/business';
import { ProfileInputType, ProfileType } from '@/types/profile';
import React, { useContext, useState } from "react";
import { z } from 'zod';
import { DateTime } from 'luxon';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"


function processAndSendDate(inputDate: Date) {
    // If inputDate is a string or JS Date, convert it to a Luxon DateTime object
    const date = DateTime.fromJSDate(new Date(inputDate));  // Or DateTime.fromISO if string

    // Normalize the date by setting the time to midnight (local timezone)
    const localDate = date.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });

    // Convert to 'YYYY-MM-DD' format to send to the backend
    const formattedDate = localDate.toFormat('yyyy-MM-dd');

    // Send `formattedDate` to your backend (for demonstration purposes, we'll log it)
    console.log(formattedDate); // Example: '2024-10-15'

    // Send `formattedDate` to backend using your API (e.g., fetch or axios)
}

export const onBoardingSteps = [
    {
        title: 'Create your profile',
        description: "This will be your profile linked to all your activity",
        subSteps: [{
            name: 'Profile',
            form: <OnboardingProfileForm />,
            className: "max-w-[672px]"
        }, {
            name: 'Address',
            form: <OnboardingAddressForm />,
            className: "max-w-[672px]"
        }]
    },
    {
        title: 'Create a company',
        description: "This will be one of the company for which all the. ",
        subSteps: [{
            name: 'Company detail',
            form: <OnboardingCompanyInTakeForm />,
            className: "max-w-[672px]"
        }, {
            name: 'Business',
            form: <OnboardingCompanyForm />,
            className: "max-w-[672px]"
        }]
    },
    {
        title: 'Accounting period',
        description: "This will be used for the fiscal year and the accounting period intervals. this can;t be changed once set so double check your entry",
        subSteps: [{
            name: '',
            form: <OnboardingAccountingPeriodForm />,
            className: ""
        }]
    },
    {
        title: 'Chart of account',
        description: "Please Setup the Chart of account for the company, you can also setup just the basic to get started with, and add the rest later",
        subSteps: [{
            name: '',
            form: <OnboardingChartOfAccountForm />,
            className: ""
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
    fetchBusiness: (tin: string) => Promise<BusinessType | null>
    createUser: ({ chartOfAccounts, userId }: { chartOfAccounts: z.infer<typeof chartOfAccountsSchema>, userId: string }) => Promise<ProfileType | null>
    fiscalYear: z.infer<typeof yearSchema> | undefined
    setFiscalYear: (fiscalYear: z.infer<typeof yearSchema>) => void,
    chartOfAccountForm: UseFormReturn<z.infer<typeof chartOfAccountsSchema>> | undefined
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
    createUser: async ({ ownerAddressData, userId }: { ownerAddressData?: z.infer<typeof addressSchema>, userId: string }) => { return null },
    fetchBusiness: async (tin: string) => { return null },
    fiscalYear: undefined,
    setFiscalYear: () => { },
    chartOfAccountForm: undefined
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
        //     "tin": "0000030603"
        // }

        null
    );
    const [business, setBusiness] = useState<BusinessType | null>(null);
    const [company, setCompany] = useState<z.infer<typeof companySchema> | null>(null);
    const [fiscalYear, setFiscalYear] = useState<z.infer<typeof yearSchema> | undefined>()



    const createUser = async ({ chartOfAccounts, userId }: { chartOfAccounts: z.infer<typeof chartOfAccountsSchema>, userId: string }): Promise<ProfileType> => {
        if (!business) throw new Error("Business has not been setup")
        if (!address) throw new Error("Address has not been setup")
        if (!company) throw new Error("company has not been setup")
        if (!companyIntake) throw new Error("companyIntake has not been setup")
        if (!profile) throw new Error("profile has not been setup")
        if (!fiscalYear) throw new Error("Fiscal year required has not been setup")


        let profileInputData: ProfileInputType | undefined = undefined

        profileInputData = {
            name: profile.fullName,
            dateBirth: profile.dateOfBirth,
            gender: profile.gender === "male" ? "Male" : "Female",
            phoneNumber: profile.phoneNumber ?? "",
            email: profile.email,
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
                    email: company.email,
                    managerName: company.managerName
                },
                profile: {
                    userId,
                    ...profileInputData
                },
                fiscalYear,
                chartOfAccounts
            })

            return profileData;
        } catch (e) {
            console.log(e)
            throw new Error("e")
        }


    }



    const fetchBusiness = async (tin: string): Promise<BusinessType | null> => {
        try {
            const businessData = await fetchBusinessApi(tin);
            setBusiness(businessData);
            return businessData
        } catch (e: any) {
            console.log(e)
            throw new Error(e)
        }
    }


    const chartOfAccountForm = useForm<z.infer<typeof chartOfAccountsSchema>>({
        resolver: zodResolver(chartOfAccountsSchema),
        defaultValues: {
            accounts: [
                {
                    accountType: "Cash",
                    balance: {
                        amount: 0
                    },
                    name: "",
                    code: 1001,
                }, {
                    accountType: "Account_receivable",
                    balance: {
                        amount: 0
                    },
                    name: "Vat Receivable",
                    code: 1011,
                }, {
                    accountType: "Equity_does_not_close",
                    balance: {
                        amount: 0
                    },
                    name: "",
                    code: 3001,
                }, {
                    accountType: "Account_payable",
                    balance: {
                        amount: 0
                    },
                    name: "Withholding Payable",
                    code: 2001,
                }
            ]
        },
    })


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
                profile,
                setAddress,
                setBusiness,
                setCompany,
                setCompanyIntake,
                setProfile,
                createUser,
                fetchBusiness,
                fiscalYear,
                setFiscalYear,
                chartOfAccountForm
            }}
        >
            {children}
        </OnboardingContext.Provider>
    );
};

export { OnboardingProvider, useOnboarding };