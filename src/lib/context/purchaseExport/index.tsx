'use client'

import { GebiwochPurchaseCSV } from '@/lib/data/export/gebiwochPurchaseCSV';
import React, { useState } from 'react';
import { useContext } from 'react';
import { BaseDirectory, writeTextFile } from '@tauri-apps/plugin-fs';
import { save } from '@tauri-apps/plugin-dialog';

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
        const result = await GebiwochPurchaseCSV({
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
            const filePath = 'users.csv';

            try {

                // Open a file dialog for the user to choose where to save the file
                const filePath = await save({
                    filters: [{
                        name: 'CSV File',
                        extensions: ['csv']
                    }],
                    defaultPath: 'data.csv'
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

                // const arrayBuffer = await blob.arrayBuffer();
                // const contents = new Uint8Array(arrayBuffer);
                // // await writeFile({
                // //     path: filePath,
                // //     contents: new Uint8Array(blob as )
                // //   });

                // await writeFile('config', contents, {
                //     baseDir: BaseDirectory.AppConfig,
                // });
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
                purchaseCSV
            }}
        >
            {children}
        </ExportPurchaseContext.Provider>
    );
};

export { ExportPurchaseProvider, useExportPurchase };
