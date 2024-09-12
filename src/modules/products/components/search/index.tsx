"use client"

import { useState } from "react"
import { ProductDrawerTable } from './listing'
import { DrawerAddProductSection } from './add'
import { ProductType } from '@/lib/form/product/data'


export const ProductListing = ({ updateProduct }: { updateProduct: (product: ProductType[]) => void }) => {


    const [isAddingProduct, setIsAddingProduct] = useState(false)

    return (
        <div className="h-full relative pt-28 overflow-hidden ">
            {isAddingProduct ?
                <DrawerAddProductSection
                    setIsAddingProduct={(value: boolean) => {
                        setIsAddingProduct(value)
                    }}
                    updateProduct={updateProduct}
                />
                :
                <ProductDrawerTable
                    setIsAddingProduct={setIsAddingProduct}
                    updateProduct={updateProduct}
                />
            }


        </div>
    )
}