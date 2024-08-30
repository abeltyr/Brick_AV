'use client'

import React from 'react'
import { EmptyState } from '../component'

export const VendorEmptyState = () => {
    return (
        <EmptyState
            title='No vendor added'
            description='Description text of Vendor.'
            actionButtonText='Add Vendor'
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
