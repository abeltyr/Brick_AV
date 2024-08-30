'use client'

import React from 'react'
import { EmptyState } from '../component'

export const PurchaseEmptyState = () => {
    return (
        <EmptyState
            title='No vendor added'
            description='Description text of Vendor.'
            buttonText='Add Vendor'
            action={() => {
                alert("Hello")
            }}
        />
    )
}
