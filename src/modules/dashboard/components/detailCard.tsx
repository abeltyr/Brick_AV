import { LanguageTranslator } from '@/modules/language/components'
import { Card, CardContent, CardHeader, CardTitle } from '@/modules/ui/card'
import { Activity, CreditCard, DollarSign, Users } from 'lucide-react'
import React from 'react'

export const DetailCard = () => {
    return (
        <div className="flex gap-4  lg:gap-8 flex-wrap">
            <Card x-chunk="dashboard-01-chunk-0" className='flex-1 min-w-[100%] xsm:min-w-[50%] lg:min-w-fit'>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        <LanguageTranslator>
                            Total Purchase
                        </LanguageTranslator>
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        <LanguageTranslator>
                            ETB
                        </LanguageTranslator>
                        {" "} 45,231.89</div>
                    <p className="text-xs text-muted-foreground">
                        +20.1% {" "}
                        <LanguageTranslator>
                            from last month
                        </LanguageTranslator>
                    </p>
                </CardContent>
            </Card>
            <Card x-chunk="dashboard-01-chunk-1" className='flex-1 min-w-[100%] xsm:min-w-[50%] lg:min-w-fit'>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        <LanguageTranslator>
                            Before</LanguageTranslator>
                        {" "}
                        <LanguageTranslator>
                            Vat
                        </LanguageTranslator>
                    </CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">2350</div>
                    <p className="text-xs text-muted-foreground">
                        +180.1% {" "}
                        <LanguageTranslator>
                            from last month
                        </LanguageTranslator>
                    </p>
                </CardContent>
            </Card>
            <Card x-chunk="dashboard-01-chunk-2" className='flex-1'>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium"><LanguageTranslator>
                        Vat</LanguageTranslator>
                        {" "}
                        <LanguageTranslator>Amount
                        </LanguageTranslator></CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">12,234</div>
                    <p className="text-xs text-muted-foreground">
                        +19% {" "}
                        <LanguageTranslator>
                            from last month
                        </LanguageTranslator>
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
