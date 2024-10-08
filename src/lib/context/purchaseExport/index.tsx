'use client'

import { PurchaseEtaxCsvGenerator } from '@/lib/data/export/purchaseEtaxCsv';
import React, { useState } from 'react';
import { useContext } from 'react';
import { BaseDirectory, writeTextFile } from '@tauri-apps/plugin-fs';
import { save } from '@tauri-apps/plugin-dialog';
// import { GebiwochWithHoldingCsv } from '@/lib/data/export/gebiwochWithholdingCsv';
import { DateRangeType } from '@/types/shared';
import { open } from '@tauri-apps/plugin-shell'
import { useToast } from '@/modules/ui/use-toast';
import { File } from 'lucide-react';
import { PurchaseTassCsvGenerator } from '@/lib/data/export/purchaseTassCSV';
import { PurchaseLtoCsvGenerator } from '@/lib/data/export/purchaseLtoCSV';
import { WithholdingEtaxCSVGenerator } from '@/lib/data/export/withholdingEtaxCSV';

const initialValues: {
    purchaseEtaxCsv: { [id: string]: string };
    purchaseTassCsv: { [id: string]: string };
    purchaseLtoCsv: { [id: string]: string };
    withholdingEtaxCsv: { [id: string]: string };
    fetchPurchaseEtaxCsv: ({ }: { dateRange: DateRangeType, companyId: string }) => void;
    fetchPurchaseTassCsv: ({ }: { dateRange: DateRangeType, companyId: string }) => void;
    fetchPurchaseLtoCsv: ({ }: { dateRange: DateRangeType, companyId: string }) => void;
    fetchWithholdingEtaxCsv: ({ }: { dateRange: DateRangeType, companyId: string }) => void,
    loading: boolean
} = {
    purchaseEtaxCsv: {},
    purchaseTassCsv: {},
    purchaseLtoCsv: {},
    withholdingEtaxCsv: {},
    fetchPurchaseEtaxCsv: ({ }: {
        dateRange: DateRangeType,
        companyId: string
    }) => { },
    fetchPurchaseTassCsv: ({ }: {
        dateRange: DateRangeType,
        companyId: string
    }) => { },
    fetchPurchaseLtoCsv: ({ }: {
        dateRange: DateRangeType,
        companyId: string
    }) => { },
    fetchWithholdingEtaxCsv: ({ }: {
        dateRange: DateRangeType,
        companyId: string
    }) => { },
    loading: false,
};

type Props = {
    children?: React.ReactNode;
};

const ExportPurchaseContext = React.createContext(initialValues);

const useExportPurchase = () => useContext(ExportPurchaseContext);

const ExportPurchaseProvider: React.FC<Props> = ({ children }) => {

    const [purchaseEtaxCsv, setPurchaseEtaxCsv] = useState<{ [id: string]: string }>({});
    const [purchaseTassCsv, setPurchaseTassCsv] = useState<{ [id: string]: string }>({});
    const [purchaseLtoCsv, setPurchaseLtoCsv] = useState<{ [id: string]: string }>({});
    const [withholdingEtaxCsv, setWithholdingEtaxCsv] = useState<{ [id: string]: string }>({});
    const [loading, setLoading] = useState(false)

    const { toast } = useToast()


    const fetchPurchaseEtaxCsv = async ({ dateRange, companyId }: { companyId: string, dateRange: DateRangeType, }) => {
        if (!loading) {
            setLoading(true)
            try {
                const result = await PurchaseEtaxCsvGenerator({
                    companyId, dateRange
                })
                if (result.success && result.data) {
                    const blob = new Blob([result.data], { type: 'text/csv' })
                    const url = window.URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.style.display = 'none'
                    const filePathData = `PURCHASE_ETAX_${dateRange.startDate.getDate()}-${dateRange.startDate.getMonth() + 1}-${dateRange.startDate.getFullYear()}_${dateRange.endDate.getDate()}-${dateRange.endDate.getMonth() + 1}-${dateRange.endDate.getFullYear()}.csv`;

                    a.href = url
                    a.download = filePathData;
                    document.body.appendChild(a)
                    a.click()
                    window.URL.revokeObjectURL(url)

                    try {
                        // Open a file dialog for the user to choose where to save the file
                        const filePath = await save({
                            filters: [{
                                name: 'Csv File',
                                extensions: ['csv']
                            }],
                            defaultPath: filePathData
                        });

                        // If the user cancels the save dialog, filePath will be null
                        if (filePath === null) {
                            console.log('File save cancelled');
                            return;
                        }

                        // Write the Csv content to the selected file
                        await writeTextFile(filePath, result.data, {
                            baseDir: BaseDirectory.AppConfig,
                        });

                        toast({
                            title: 'Report Generated and downloaded',
                            description: (
                                <div className="mt-2 w-full rounded-md bg-slate-950 p-4 text-green-300 font-medium text-sm flex flex-col gap-2">
                                    <p>
                                        Your report has been downloaded can access it here
                                    </p>
                                    <div className='flex gap-2 bg-white text-black cursor-pointer w-full px-3 py-2 rounded-md' onClick={() => { open(filePath.split(`/${filePathData}`)[0]); }}>
                                        <File />
                                        Open in Folder
                                    </div>
                                </div>
                            ),
                        })
                    } catch (e) {
                        console.log(e);
                        console.log('File not saved at:', filePathData, e);
                        toast({
                            title: 'Failed Saving file',
                            description: (
                                <div className="mt-2 w-full rounded-md bg-slate-950 p-4 text-red-300 font-medium text-sm">
                                    An error occurred please try again. If the issue persists, please wait a moment before attempt again. If the issue still persists, please contact us here.
                                </div>
                            ),
                        })
                    }
                } else {
                    throw new Error('Failed to generate Csv')
                }
            } catch (e) {
                toast({
                    title: "Failed generate Report",
                    description: (
                        <div className="mt-2 w-full rounded-md bg-slate-950 p-4 text-red-300 font-medium text-sm">
                            An error occurred please try again. If the issue persists, please wait a moment before attempt again. If the issue still persists, please contact us here.
                        </div>
                    ),
                })
            }
            setLoading(false)
        }
    }


    const fetchPurchaseTassCsv = async ({ dateRange, companyId }: { companyId: string, dateRange: DateRangeType, }) => {
        if (!loading) {
            setLoading(true)
            try {
                const result = await PurchaseTassCsvGenerator({
                    companyId,
                    dateRange
                })
                if (result.success && result.data) {
                    const blob = new Blob([result.data], { type: 'text/csv' })
                    const url = window.URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.style.display = 'none'
                    const filePathData = `PURCHASE_TASS_${dateRange.startDate.getDate()}-${dateRange.startDate.getMonth() + 1}-${dateRange.startDate.getFullYear()}_${dateRange.endDate.getDate()}-${dateRange.endDate.getMonth() + 1}-${dateRange.endDate.getFullYear()}.csv`;

                    a.href = url
                    a.download = filePathData;
                    document.body.appendChild(a)
                    a.click()
                    window.URL.revokeObjectURL(url)

                    try {
                        // Open a file dialog for the user to choose where to save the file
                        const filePath = await save({
                            filters: [{
                                name: 'Csv File',
                                extensions: ['csv']
                            }],
                            defaultPath: filePathData
                        });

                        // If the user cancels the save dialog, filePath will be null
                        if (filePath === null) {
                            console.log('File save cancelled');
                            return;
                        }

                        // Write the Csv content to the selected file
                        await writeTextFile(filePath, result.data, {
                            baseDir: BaseDirectory.AppConfig,
                        });

                        toast({
                            title: 'Report Generated and downloaded',
                            description: (
                                <div className="mt-2 w-full rounded-md bg-slate-950 p-4 text-green-300 font-medium text-sm flex flex-col gap-2">
                                    <p>
                                        Your report has been downloaded can access it here
                                    </p>
                                    <div className='flex gap-2 bg-white text-black cursor-pointer w-full px-3 py-2 rounded-md' onClick={() => { open(filePath.split(`/${filePathData}`)[0]); }}>
                                        <File />
                                        Open in Folder
                                    </div>
                                </div>
                            ),
                        })
                    } catch (e) {
                        console.log(e);
                        console.log('File not saved at:', filePathData, e);
                        toast({
                            title: 'Failed Saving file',
                            description: (
                                <div className="mt-2 w-full rounded-md bg-slate-950 p-4 text-red-300 font-medium text-sm">
                                    An error occurred please try again. If the issue persists, please wait a moment before attempt again. If the issue still persists, please contact us here.
                                </div>
                            ),
                        })
                    }
                } else {
                    throw new Error('Failed to generate Csv')
                }
            } catch (e) {
                toast({
                    title: "Failed generate Report",
                    description: (
                        <div className="mt-2 w-full rounded-md bg-slate-950 p-4 text-red-300 font-medium text-sm">
                            An error occurred please try again. If the issue persists, please wait a moment before attempt again. If the issue still persists, please contact us here.
                        </div>
                    ),
                })
            }
            setLoading(false)
        }
    }

    const fetchPurchaseLtoCsv = async ({ dateRange, companyId }: { companyId: string, dateRange: DateRangeType, }) => {
        if (!loading) {
            setLoading(true)
            try {
                const result = await PurchaseLtoCsvGenerator({
                    companyId,
                    dateRange
                })
                if (result.success && result.data) {
                    const blob = new Blob([result.data], { type: 'text/csv' })
                    const url = window.URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.style.display = 'none'
                    const filePathData = `PURCHASE_LTO_${dateRange.startDate.getDate()}-${dateRange.startDate.getMonth() + 1}-${dateRange.startDate.getFullYear()}_${dateRange.endDate.getDate()}-${dateRange.endDate.getMonth() + 1}-${dateRange.endDate.getFullYear()}.csv`;

                    a.href = url
                    a.download = filePathData;
                    document.body.appendChild(a)
                    a.click()
                    window.URL.revokeObjectURL(url)

                    try {
                        // Open a file dialog for the user to choose where to save the file
                        const filePath = await save({
                            filters: [{
                                name: 'Csv File',
                                extensions: ['csv']
                            }],
                            defaultPath: filePathData
                        });

                        // If the user cancels the save dialog, filePath will be null
                        if (filePath === null) {
                            console.log('File save cancelled');
                            return;
                        }

                        // Write the Csv content to the selected file
                        await writeTextFile(filePath, result.data, {
                            baseDir: BaseDirectory.AppConfig,
                        });

                        toast({
                            title: 'Report Generated and downloaded',
                            description: (
                                <div className="mt-2 w-full rounded-md bg-slate-950 p-4 text-green-300 font-medium text-sm flex flex-col gap-2">
                                    <p>
                                        Your report has been downloaded can access it here
                                    </p>
                                    <div className='flex gap-2 bg-white text-black cursor-pointer w-full px-3 py-2 rounded-md' onClick={() => { open(filePath.split(`/${filePathData}`)[0]); }}>
                                        <File />
                                        Open in Folder
                                    </div>
                                </div>
                            ),
                        })
                    } catch (e) {
                        console.log(e);
                        console.log('File not saved at:', filePathData, e);
                        toast({
                            title: 'Failed Saving file',
                            description: (
                                <div className="mt-2 w-full rounded-md bg-slate-950 p-4 text-red-300 font-medium text-sm">
                                    An error occurred please try again. If the issue persists, please wait a moment before attempt again. If the issue still persists, please contact us here.
                                </div>
                            ),
                        })
                    }
                } else {
                    throw new Error('Failed to generate Csv')
                }
            } catch (e) {
                toast({
                    title: "Failed generate Report",
                    description: (
                        <div className="mt-2 w-full rounded-md bg-slate-950 p-4 text-red-300 font-medium text-sm">
                            An error occurred please try again. If the issue persists, please wait a moment before attempt again. If the issue still persists, please contact us here.
                        </div>
                    ),
                })
            }
            setLoading(false)
        }
    }

    const fetchWithholdingEtaxCsv = async ({ dateRange, companyId }: { dateRange: DateRangeType, companyId: string }) => {
        if (!loading) {
            setLoading(true)
            try {
                const result = await WithholdingEtaxCSVGenerator({
                    companyId,
                    dateRange
                })
                if (result.success && result.data) {
                    const blob = new Blob([result.data], { type: 'text/csv' })
                    const url = window.URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.style.display = 'none'
                    const filePathData = `WITHHOLDING_ETAX_${dateRange.startDate.getDate()}-${dateRange.startDate.getMonth() + 1}-${dateRange.startDate.getFullYear()}_${dateRange.endDate.getDate()}-${dateRange.endDate.getMonth() + 1}-${dateRange.endDate.getFullYear()}.csv`;

                    a.href = url
                    a.download = filePathData;
                    document.body.appendChild(a)
                    a.click()
                    window.URL.revokeObjectURL(url)

                    try {
                        // Open a file dialog for the user to choose where to save the file
                        const filePath = await save({
                            filters: [{
                                name: 'Csv File',
                                extensions: ['csv']
                            }],
                            defaultPath: filePathData
                        });

                        // If the user cancels the save dialog, filePath will be null
                        if (filePath === null) {
                            console.log('File save cancelled');
                            return;
                        }

                        // Write the Csv content to the selected file
                        await writeTextFile(filePath, result.data, {
                            baseDir: BaseDirectory.AppConfig,
                        });

                        toast({
                            title: 'Report Generated and downloaded',
                            description: (
                                <div className="mt-2 w-full rounded-md bg-slate-950 p-4 text-green-300 font-medium text-sm flex flex-col gap-2">
                                    <p>
                                        Your report has been downloaded can access it here
                                    </p>
                                    <div className='flex gap-2 bg-white text-black cursor-pointer w-full px-3 py-2 rounded-md' onClick={() => { open(filePath.split(`/${filePathData}`)[0]); }}>
                                        <File />
                                        Open in Folder
                                    </div>
                                </div>
                            ),
                        })
                    } catch (e) {
                        console.log(e);
                        console.log('File not saved at:', filePathData, e);
                        toast({
                            title: 'Failed Saving file',
                            description: (
                                <div className="mt-2 w-full rounded-md bg-slate-950 p-4 text-red-300 font-medium text-sm">
                                    An error occurred please try again. If the issue persists, please wait a moment before attempt again. If the issue still persists, please contact us here.
                                </div>
                            ),
                        })
                    }
                } else {
                    throw new Error('Failed to generate Csv')
                }
            } catch (e) {
                toast({
                    title: "Failed generate Report",
                    description: (
                        <div className="mt-2 w-full rounded-md bg-slate-950 p-4 text-red-300 font-medium text-sm">
                            An error occurred please try again. If the issue persists, please wait a moment before attempt again. If the issue still persists, please contact us here.
                        </div>
                    ),
                })
            }
            setLoading(false)
        }
    }

    return (
        <ExportPurchaseContext.Provider
            value={{
                purchaseEtaxCsv,
                purchaseTassCsv,
                purchaseLtoCsv,
                withholdingEtaxCsv,
                loading,
                fetchPurchaseEtaxCsv,
                fetchPurchaseTassCsv,
                fetchPurchaseLtoCsv,
                fetchWithholdingEtaxCsv
            }}
        >
            {children}
        </ExportPurchaseContext.Provider>
    );
};

export { ExportPurchaseProvider, useExportPurchase };
