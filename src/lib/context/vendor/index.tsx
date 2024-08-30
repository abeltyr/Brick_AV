'use client'


import { fetchVendorsByCompanyIdAction } from '@/lib/data/vendor/fetchByCompanyId';
import { Filter, loadLimit } from '@/types/shared';
import { VendorType } from '@/types/vendor';
import React, { useCallback, useContext, useState } from "react";


const initialValues: {
    vendors: { [id: string]: VendorType[] },
    loadMoreData: boolean,
    setupVendorsData: ({ dataVendors, companyId }: { dataVendors: VendorType[], companyId: string }) => void,
    fetchVendors: ({ companyId }: { companyId: string }) => void,
    fetchingVendors: boolean,
} = {
    vendors: {},
    loadMoreData: true,
    setupVendorsData: ({ }: { dataVendors: VendorType[], companyId: string }) => { },
    fetchVendors: ({ }: { companyId: string }) => { },
    fetchingVendors: true,
};

type Props = {
    children?: React.ReactNode;
};

const VendorsContext = React.createContext(initialValues);

const useVendors = () => useContext(VendorsContext);

const VendorsProvider: React.FC<Props> = ({ children }) => {
    const [vendors, setVendors] = useState<{ [id: string]: VendorType[] }>({})
    const [loadMoreData, setLoadMoreData] = useState<boolean>(true)
    const [fetchingVendors, setFetchingVendors] = useState<boolean>(true)



    const setupVendorsData = ({ dataVendors, companyId }: { dataVendors: VendorType[], companyId: string }) => {

        const vendorsData = { ...vendors }

        vendorsData[companyId] = dataVendors;

        setVendors(vendorsData);

        if (dataVendors.length < loadLimit) {
            setLoadMoreData(false)
        } else {
            setLoadMoreData(true)
        }
        setFetchingVendors(false);
    };



    const fetchVendors = useCallback(
        async ({ companyId }: { companyId: string }) => {

            if (fetchingVendors) return;

            setFetchingVendors(true);
            try {
                const filter: Filter = {
                    limit: loadLimit,
                }

                if (vendors[companyId].length > 0) {
                    filter.after = vendors[companyId][length - 1].id
                }


                const newVendors = await fetchVendorsByCompanyIdAction({
                    companyId,
                    filter
                });


                const vendorsData = { ...vendors };
                if (vendorsData[companyId])
                    vendorsData[companyId] = [...vendorsData[companyId], ...newVendors]
                else {
                    vendorsData[companyId] = [...newVendors]
                }

                setVendors(vendorsData);
                if (newVendors.length < loadLimit) {
                    setLoadMoreData(false)
                }
            } catch (e) {

            }

            setFetchingVendors(false);
        },
        [vendors, fetchingVendors],
    );


    return (
        <VendorsContext.Provider
            value={{
                vendors,
                loadMoreData,
                setupVendorsData,
                fetchingVendors,
                fetchVendors
            }}
        >
            {children}
        </VendorsContext.Provider>
    );
};

export { VendorsProvider, useVendors };