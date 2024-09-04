'use client'

import { exportGebiwochPurchaseCSV } from '@/lib/data/purchase/export';
import React, { useState } from 'react';
import { useContext } from 'react';

const initialValues: {
    purchaseCSV: { [id: string]: string };
    fetchPurchaseCSV: ({ year, month, companyId }: { year: number, month: number, companyId: string }) => void;

} = {
    purchaseCSV: {},
    fetchPurchaseCSV: ({ year, month, companyId }: { year: number, month: number, companyId: string }) => {

    },

};

type Props = {
    children?: React.ReactNode;
};

const ExportPurchaseContext = React.createContext(initialValues);

const useExportPurchase = () => useContext(ExportPurchaseContext);

const ExportPurchaseProvider: React.FC<Props> = ({ children }) => {

    const [purchaseCSV, setPurchaseCSV] = useState<{ [id: string]: string }>({});
    const [loading, setLoading] = useState(false)


    const fetchPurchaseCSV = async ({ year, month, companyId }: { year: number, month: number, companyId: string }) => {

        setLoading(true)
        const result = await exportGebiwochPurchaseCSV({
            companyId,
            month,
            year
        })
        setLoading(false)

        if (result.success && result.data) {
            const blob = new Blob([result.data], { type: 'text/csv' })
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.style.display = 'none'
            a.href = url
            a.download = 'users.csv'
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
        } else {
            alert('Failed to generate CSV')
        }




    }

    return (
        <ExportPurchaseContext.Provider
            value={{
                fetchPurchaseCSV,
                purchaseCSV
            }}
        >
            {children}
        </ExportPurchaseContext.Provider>
    );
};

export { ExportPurchaseProvider, useExportPurchase };
