'use client'


import { createVenderAction } from '@/lib/data/vendor/create';
import { fetchVendorsByCompanyIdAction } from '@/lib/data/vendor/fetchByCompanyId';
import { filter, Filter, loadLimit } from '@/types/shared';
import { VendorType } from '@/types/vendor';
import React, { useCallback, useContext, useState } from "react";


const initialValues: {
    vendors: { [id: string]: VendorType[] },
    loadMoreData: boolean,
    setupVendorsData: ({ dataVendors, companyId }: { dataVendors: VendorType[], companyId: string }) => void,
    fetchVendors: ({ companyId }: { companyId: string }) => void,
    getVendor: ({ companyId }: { companyId: string }) => void,
    fetchingVendors: boolean,
    initialLoading: boolean,
    createVendor: ({ }: {
        name?: string;
        tinNumber: string;
        companyName?: string;
        vatNumber?: string;
        email?: string;
        phoneNumber?: string;
        region?: string;
        city?: string;
        woreda?: string;
        houseNumber?: string;
        description?: string;
        companyId: string;
    }) => Promise<VendorType | null>,
    searchVendor: ({ companyId, keyTerm }: { companyId: string, keyTerm: string }) => Promise<VendorType[]>
} = {
    vendors: {},
    loadMoreData: true,
    setupVendorsData: ({ }: { dataVendors: VendorType[], companyId: string }) => { },
    fetchVendors: ({ }: { companyId: string }) => { },
    getVendor: ({ }: { companyId: string }) => { },
    fetchingVendors: true,
    initialLoading: true,
    createVendor: async ({ }: {
        name?: string;
        tinNumber: string;
        companyName?: string;
        vatNumber?: string;
        email?: string;
        phoneNumber?: string;
        region?: string;
        city?: string;
        woreda?: string;
        houseNumber?: string;
        description?: string;
        companyId: string;
    }): Promise<VendorType | null> => { return null },
    searchVendor: async ({ companyId, keyTerm }: { companyId: string, keyTerm: string }): Promise<VendorType[]> => { return [] }
};

type Props = {
    children?: React.ReactNode;
};

const VendorsContext = React.createContext(initialValues);

const useVendors = () => useContext(VendorsContext);

const VendorsProvider: React.FC<Props> = ({ children }) => {
    const [vendors, setVendors] = useState<{ [id: string]: VendorType[] }>({})
    const [loadMoreData, setLoadMoreData] = useState<boolean>(true)
    const [fetchingVendors, setFetchingVendors] = useState<boolean>(false)
    const [initialLoading, setInitialLoading] = useState<boolean>(true)



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




    const createVendor = async ({ name, tinNumber, companyName, vatNumber, email, phoneNumber, region, city, woreda, houseNumber, description, companyId }: {
        name?: string;
        tinNumber: string;
        companyName?: string;
        vatNumber?: string;
        email?: string;
        phoneNumber?: string;
        region?: string;
        city?: string;
        woreda?: string;
        houseNumber?: string;
        description?: string;
        companyId: string;
    }): Promise<VendorType | null> => {

        try {
            const vendorsData = { ...vendors }
            console.log("companyId", companyId)
            const newVendor = await createVenderAction({
                companyId,
                address: {
                    city,
                    description,
                    houseNumber,
                    region,
                    woreda
                },
                profile: {
                    name,
                    companyName,
                    phoneNumber,
                    email,
                    tinNumber,
                    vatNumber,
                }
            })
            vendorsData[companyId] = [newVendor, ...vendorsData[companyId]];
            setVendors(vendorsData);
            return newVendor;
        }
        catch (e) {
            console.log(e)
            throw new Error("Error Creating the vendor")
        }

    };


    const getVendor = useCallback(
        async ({ companyId }: { companyId: string }) => {
            setInitialLoading(true);
            try {
                const newVendors = await fetchVendorsByCompanyIdAction({
                    companyId,
                    filter
                });
                const vendorsData = { ...vendors };
                vendorsData[companyId] = [...newVendors]
                if (newVendors.length < loadLimit) {
                    setLoadMoreData(false)
                } else {
                    setLoadMoreData(true)
                }
                setVendors(vendorsData);
            } catch (e) {
                console.log(e)
            }
            setInitialLoading(false);
        },
        [vendors],
    );

    const fetchVendors = useCallback(
        async ({ companyId }: { companyId: string }) => {

            if (!fetchingVendors) {
                setFetchingVendors(true);
                try {
                    const vendorsData = { ...vendors };
                    const filter: Filter = {
                        limit: loadLimit,
                    }

                    if (vendorsData[companyId] && vendorsData[companyId].length > 0) {
                        filter.after = vendors[companyId][vendors[companyId].length - 1].id
                    }

                    const newVendors = await fetchVendorsByCompanyIdAction({
                        companyId,
                        filter
                    });

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
                    console.log(e)
                    alert("e")
                    // throw new Error("error")
                }
                setFetchingVendors(false);
            }
        },
        [vendors, fetchingVendors],
    );

    const searchVendor = useCallback(
        async ({ companyId, keyTerm }: { companyId: string, keyTerm: string }): Promise<VendorType[]> => {
            const newVendors = await fetchVendorsByCompanyIdAction({
                companyId,
                keyTerm,
                filter
            });
            return newVendors
        },
        [],
    );


    return (
        <VendorsContext.Provider
            value={{
                vendors,
                initialLoading,
                loadMoreData,
                setupVendorsData,
                fetchingVendors,
                fetchVendors,
                createVendor,
                getVendor,
                searchVendor
            }}
        >
            {children}
        </VendorsContext.Provider>
    );
};

export { VendorsProvider, useVendors };