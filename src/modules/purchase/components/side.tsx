import React from 'react'
import PurchaseVendorForm from './side/purchaseVendorForm'
import { Card, CardContent } from '@/modules/ui/card';
import { Separator } from '@/modules/ui/separator';

const AddPurchaseSideSection = () => {


    return (
        <Card className=''>
            <CardContent className='pt-8 px-6'>
                <PurchaseVendorForm />
                <Separator className='my-8' />
                <PurchaseVendorForm />
            </CardContent>
        </Card>
    )
}

export default AddPurchaseSideSection