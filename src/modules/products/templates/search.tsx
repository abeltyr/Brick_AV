"use client"

import { DrawerSheetHeader } from '@/modules/common/components/drawer/header'
import { ProductListing } from '@/modules/products/components/search'
import { ProductType } from '@/types/product'


export const SearchProductSection = ({ updateProduct }: { updateProduct: (product: ProductType[]) => void }) => {

    return (
        <div className='w-full h-full overflow-y-hidden'>
            <DrawerSheetHeader title={"Products"} description='Search the product this purchase is made from. if it is a new product you can create it here.' />
            <div className='flex-1 relative w-full h-full overflow-hidden'>
                <ProductListing updateProduct={updateProduct} />
            </div>
        </div>
    )
}
