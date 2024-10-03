import React from 'react'
import { Card, CardContent } from '@/modules/ui/card';
import { Separator } from '@/modules/ui/separator';
import PurchaseVendorForm from './side/purchaseVendorForm';
import ChartOfAccountListSection from './side/chartOfAccountList';
import PurchaseSummationSection from './side/purchaseSummation';
import WithholdingBreakdownSection from './side/withholdingBreakdown';

const AddPurchaseSideSection = () => {


    return (
        <Card className=''>
            <CardContent className=' px-6'>
                <PurchaseVendorForm />
                <Separator className='my-8' />
                <ChartOfAccountListSection />
                <Separator className='my-8' />
                <PurchaseSummationSection />
                <WithholdingBreakdownSection />
            </CardContent>
        </Card>
    )
}

export default AddPurchaseSideSection