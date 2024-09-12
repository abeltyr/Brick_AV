'use client'

import { GebiwochPurchaseCSV } from '@/lib/data/export/gebiwochPurchaseCSV';
import React, { useState } from 'react';
import { useContext } from 'react';
import { BaseDirectory, writeTextFile } from '@tauri-apps/plugin-fs';
import { save } from '@tauri-apps/plugin-dialog';
import { GebiwochWithHoldingCSV } from '@/lib/data/export/gebiwochWithholdingCSVt';

const initialValues: {
    purchaseCSV: { [id: string]: string };
    withholdingCSV: { [id: string]: string };
    fetchPurchaseCSV: ({ year, month, companyId }: { year: number, month: number, companyId: string }) => void;
    fetchWithholdingCSV: ({ year, month, companyId }: { year: number, month: number, companyId: string }) => void,
    purchaseLoading: boolean,
    withholdingLoading: boolean
} = {
    purchaseCSV: {},
    withholdingCSV: {},
    fetchPurchaseCSV: ({ }: {
        year: number,
        month: number,
        companyId: string
    }) => { },
    fetchWithholdingCSV: ({ }: {
        year: number,
        month: number,
        companyId: string
    }) => { },
    purchaseLoading: false,
    withholdingLoading: false
};

type Props = {
    children?: React.ReactNode;
};

const ExportPurchaseContext = React.createContext(initialValues);

const useExportPurchase = () => useContext(ExportPurchaseContext);

const ExportPurchaseProvider: React.FC<Props> = ({ children }) => {

    const [purchaseCSV, setPurchaseCSV] = useState<{ [id: string]: string }>({});
    const [withholdingCSV, setWithholdingCSV] = useState<{ [id: string]: string }>({});
    const [purchaseLoading, setPurchaseLoading] = useState(false)
    const [withholdingLoading, setWithholdingLoading] = useState(false)


    const fetchPurchaseCSV = async ({ year, month, companyId }: { year: number, month: number, companyId: string }) => {
        setPurchaseLoading(true)
        const result = await GebiwochPurchaseCSV({
            companyId,
            month,
            year
        })
        setPurchaseLoading(false)
        if (result.success && result.data) {
            const blob = new Blob([result.data], { type: 'text/csv' })
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.style.display = 'none'
            a.href = url
            a.download = `purchase_${year}_${month}.csv`
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            const filePath = `purchase_${year}_${month}.csv`;

            try {

                // Open a file dialog for the user to choose where to save the file
                const filePath = await save({
                    filters: [{
                        name: 'CSV File',
                        extensions: ['csv']
                    }],
                    defaultPath: `purchase_${year}_${month}.csv`
                });

                // If the user cancels the save dialog, filePath will be null
                if (filePath === null) {
                    console.log('File save cancelled');
                    return;
                }

                // Write the CSV content to the selected file
                await writeTextFile(filePath, result.data, {
                    baseDir: BaseDirectory.AppConfig,
                });
                console.log('File saved successfully at:', filePath);

            } catch (e) {
                console.log(e);
                console.log('File not saved at:', filePath, e);
            }

        } else {
            alert('Failed to generate CSV')
        }




    }

    const fetchWithholdingCSV = async ({ year, month, companyId }: { year: number, month: number, companyId: string }) => {
        setWithholdingLoading(true)
        const result = await GebiwochWithHoldingCSV({
            companyId,
            month,
            year
        })
        setWithholdingLoading(false)
        if (result.success && result.data) {
            const blob = new Blob([result.data], { type: 'text/csv' })
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.style.display = 'none'
            a.href = url
            a.download = `withholding_${year}_${month}.csv`
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            const filePath = `withholding_${year}_${month}.csv`;

            try {

                // Open a file dialog for the user to choose where to save the file
                const filePath = await save({
                    filters: [{
                        name: 'CSV File',
                        extensions: ['csv']
                    }],
                    defaultPath: `withholding_${year}_${month}.csv`
                });

                // If the user cancels the save dialog, filePath will be null
                if (filePath === null) {
                    console.log('File save cancelled');
                    return;
                }

                // Write the CSV content to the selected file
                await writeTextFile(filePath, result.data, {
                    baseDir: BaseDirectory.AppConfig,
                });
                console.log('File saved successfully at:', filePath);

            } catch (e) {
                console.log(e);
                console.log('File not saved at:', filePath, e);
            }

        } else {
            alert('Failed to generate CSV')
        }




    }

    return (
        <ExportPurchaseContext.Provider
            value={{
                fetchPurchaseCSV,
                fetchWithholdingCSV,
                purchaseCSV,
                withholdingCSV,
                purchaseLoading,
                withholdingLoading
            }}
        >
            {children}
        </ExportPurchaseContext.Provider>
    );
};

export { ExportPurchaseProvider, useExportPurchase };
