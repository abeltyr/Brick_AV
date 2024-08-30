'use client'

import React from 'react'
import { EmptyState } from '../component'

export const ProductEmptyState = () => {
    return (
        <EmptyState
            title='No product added'
            description='Description text of Vendor.'
            buttonText='Add Product'
            action={() => {
                alert("Hello")
            }}
        />
    )
}
