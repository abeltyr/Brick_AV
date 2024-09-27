'use client'

import { GebiwochPurchaseCSV } from '@/lib/data/export/gebiwochPurchaseCSV';
import React, { useState } from 'react';
import { useContext } from 'react';
import { BaseDirectory, writeTextFile } from '@tauri-apps/plugin-fs';
import { save } from '@tauri-apps/plugin-dialog';
import { GebiwochWithHoldingCSV } from '@/lib/data/export/gebiwochWithholdingCSV';
import { DateRangeType } from '@/types/shared';

const initialValues: {
    purchaseCSV: { [id: string]: string };
    withholdingCSV: { [id: string]: string };
    fetchPurchaseCSV: ({ }: { dateRange: DateRangeType, companyId: string }) => void;
    fetchWithholdingCSV: ({ }: { dateRange: DateRangeType, companyId: string }) => void,
    purchaseLoading: boolean,
    withholdingLoading: boolean
} = {
    purchaseCSV: {},
    withholdingCSV: {},
    fetchPurchaseCSV: ({ }: {
        dateRange: DateRangeType,
        companyId: string
    }) => { },
    fetchWithholdingCSV: ({ }: {
        dateRange: DateRangeType,
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


    const fetchPurchaseCSV = async ({ dateRange, companyId }: { companyId: string, dateRange: DateRangeType, }) => {
        setPurchaseLoading(true)
        const result = await GebiwochPurchaseCSV({
            companyId, dateRange
        })
        setPurchaseLoading(false)
        if (result.success && result.data) {
            const blob = new Blob([result.data], { type: 'text/csv' })
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.style.display = 'none'
            const filePathData = `purchase_${dateRange.startDate}_${dateRange.endDate}.csv`;

            a.href = url
            a.download = filePathData;
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)

            try {

                // Open a file dialog for the user to choose where to save the file
                const filePath = await save({
                    filters: [{
                        name: 'CSV File',
                        extensions: ['csv']
                    }],
                    defaultPath: filePathData
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
                console.log('File not saved at:', filePathData, e);
            }

        } else {
            alert('Failed to generate CSV')
        }




    }

    const fetchWithholdingCSV = async ({ dateRange, companyId }: { dateRange: DateRangeType, companyId: string }) => {
        setWithholdingLoading(true)
        const result = await GebiwochWithHoldingCSV({
            companyId,
            dateRange
        })
        setWithholdingLoading(false)
        if (result.success && result.data) {
            const blob = new Blob([result.data], { type: 'text/csv' })
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.style.display = 'none'
            a.href = url
            const filePathData = `withholding_${dateRange.startDate}_${dateRange.endDate}.csv`;
            a.download = filePathData
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            const filePath = filePathData;

            try {

                // Open a file dialog for the user to choose where to save the file
                const filePath = await save({
                    filters: [{
                        name: 'CSV File',
                        extensions: ['csv']
                    }],
                    defaultPath: filePathData
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
