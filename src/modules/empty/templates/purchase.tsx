'use client'

import React from 'react'
import { EmptyState } from '../component'

export const PurchaseEmptyState = () => {
    return (
        <EmptyState
            title='No Purchase recorded'
            description='Description text of Purchase.'
            actionButtonText='Add Purchase'
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
