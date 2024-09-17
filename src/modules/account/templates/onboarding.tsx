'use client'

import { useAuth } from '@/lib/context/auth'
import { OnboardingNavBar } from '@/modules/account/components/navBar'
import { OnboardingSideBar } from '@/modules/account/components/sideBar'
import { Separator } from '@/modules/ui/separator'
import { OnboardingAddressForm } from '@/modules/account/components/form/addressForm'
import { OnboardingCompanyForm, OnboardingCompanyInTakeForm, OnboardingOwnerAddressForm, OnboardingOwnerForm, OnboardingProfileForm, } from '@/modules/account/components/form'



const steps = [
    { id: 1, title: 'Create your account', subSteps: ['Profile', 'Address'] },
    { id: 2, title: 'Create a company', subSteps: ['Company detail', 'Business'] },
    { id: 3, title: 'Create owner info', subSteps: ['Profile', 'Address'] },
    { id: 4, title: 'Set up accounting period', subSteps: [] },
]

export default function OnboardingPage() {

    const { session } = useAuth()

    const onSubmit = (data: FormData) => {
        console.log(data)

    }

    return (
        <div className="min-h-screen ">
            <OnboardingNavBar />

            <div className=' h-[8vh] max-h-20 w-full' />
            <div className="screen-parent">
                <div className='screen-padding pt-10'>

                    <div className="flex flex-col md:flex-row gap-16">
                        <div className='w-full md:w-96 relative h-full'>
                            <OnboardingSideBar />
                        </div>

                        <main className="flex-1">
                            <div className='flex flex-col'>
                                <h1 className="text-lg font-semiBold">Create your account</h1>
                                <p className="text-gray-500 text-sm">Configure how you receive notifications.</p>
                                <Separator className='my-6' />
                            </div>
                            <p className='text-lg font-semibold mb-4'>
                                Profile
                            </p>
                            {/* <OnboardingProfileForm /> */}
                            {/* <OnboardingAddressForm /> */}
                            {/* <OnboardingCompanyInTakeForm /> */}
                            {/* <OnboardingCompanyForm /> */}
                            {/* <OnboardingProfileForm /> */}
                            {/* <OnboardingOwnerForm /> */}
                            <OnboardingOwnerAddressForm />
                        </main>
                    </div>
                </div>
            </div>
        </div>
    )
}