'use client'


import { fetchBusinessApi } from '@/lib/data/business/create';
import { createVenderAction } from '@/lib/data/vendor/create';
import { fetchVendorsByCompanyIdAction } from '@/lib/data/vendor/fetchByCompanyId';
import { BusinessType } from '@/types/business';
import { filter, Filter, loadLimit } from '@/types/shared';
import { VendorInputType, VendorType } from '@/types/vendor';
import React, { useCallback, useContext, useState } from "react";


const initialValues: {
    vendors: { [id: string]: VendorType[] },
    loadMoreData: boolean,
    setupVendorsData: ({ dataVendors, companyId }: { dataVendors: VendorType[], companyId: string }) => void,
    fetchVendors: ({ companyId }: { companyId: string }) => void,
    getVendor: ({ companyId }: { companyId: string }) => void,
    fetchingVendors: boolean,
    initialLoading: boolean,
    createVendor: ({ }: VendorInputType) => Promise<VendorType | null>,
    searchVendor: ({ companyId, keyTerm }: { companyId: string, keyTerm: string }) => Promise<VendorType[]>
    fetchBusiness: (tinNumber: string) => Promise<BusinessType | null>
    business: BusinessType | null,
    setBusiness: (business: BusinessType | null) => void,
} = {
    vendors: {},
    loadMoreData: true,
    setupVendorsData: ({ }: { dataVendors: VendorType[], companyId: string }) => { },
    fetchVendors: ({ }: { companyId: string }) => { },
    getVendor: ({ }: { companyId: string }) => { },
    fetchingVendors: true,
    initialLoading: true,
    createVendor: async ({ }: VendorInputType): Promise<VendorType | null> => { return null },
    searchVendor: async ({ companyId, keyTerm }: { companyId: string, keyTerm: string }): Promise<VendorType[]> => { return [] },
    fetchBusiness: async (tinNumber: string) => { return null },
    business: null,
    setBusiness: (business) => { },
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

    const [business, setBusiness] = useState<BusinessType | null>(null);



    const fetchBusiness = async (tinNumber: string): Promise<BusinessType | null> => {
        try {
            const businessData = await fetchBusinessApi(tinNumber);
            setBusiness(businessData);
            return businessData
        } catch (e: any) {
            console.log(e)
            throw new Error(e)
        }
    }



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




    const createVendor = async (data: VendorInputType): Promise<VendorType | null> => {

        try {
            const vendorsData = { ...vendors }
            const newVendor = await createVenderAction({
                ...data,
                businessId: business ? business.id : undefined,

            }) as VendorType
            vendorsData[data.companyId] = [newVendor, ...vendorsData[data.companyId]];
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
                }) as VendorType[];
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

                    if (vendorsData[companyId]) {
                        vendorsData[companyId] = [...vendorsData[companyId] as VendorType[], ...newVendors as VendorType[]];
                    }
                    else {
                        vendorsData[companyId] = [...newVendors as VendorType[]]
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
            return newVendors as VendorType[]
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
                searchVendor,
                business,
                setBusiness,
                fetchBusiness
            }}
        >
            {children}
        </VendorsContext.Provider>
    );
};

export { VendorsProvider, useVendors };