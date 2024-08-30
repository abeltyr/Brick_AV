'use client'

import React from 'react'
import { EmptyState } from '../component'

export const ProductEmptyState = () => {
    return (
        <EmptyState
            title='No product added'
            description='Description text of Vendor.'
            actionButtonText='Add Product'
            reloadButtonText="Refetch"
            action={() => {
                alert("Hello")
            }}
            reload={() => {
                alert("Hello")
            }}
        />
    )
}
