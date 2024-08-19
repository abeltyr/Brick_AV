'use client'
import { useAuth } from '@/lib/context/auth/user';
import { CalendarDateRangePicker } from '@/modules/common/components/dateRange';
import { Button } from '@/modules/ui/button';
import React from 'react'

export const DashboardNav = () => {
    const { companies, companyIndex, companyLoading } = useAuth();
    return (
        <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">{
                companyLoading ? "Loading" :
                    companies && companies.length > companyIndex && companies[companyIndex] && companies[companyIndex].name}
                {" "} Dashboard</h2>
            <div className="flex items-center space-x-2">
                <CalendarDateRangePicker />
                <Button>Download</Button>
            </div>
        </div>
    )
}
