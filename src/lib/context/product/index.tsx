'use client'

import { createProductAction } from '@/lib/data/products/create';
import { fetchProductsByCompanyIdAction } from '@/lib/data/products/fetchByProdcutId';
import { filter, Filter, loadLimit } from '@/types/shared';
import React, { useCallback, useContext, useState } from "react";
import { DateRangeType, RangeType } from '@/types/shared';
import { defaultDateRange } from '@/lib/utils/calendar/date';
import { ProductInputType, ProductType } from '@/types/product';


const initialValues: {
    loading: boolean;
    error: boolean;
    isLoading: boolean,
    loadMoreData: boolean;
    products: { [id: string]: ProductType[] };
    fetchProducts: ({ companyId }: { companyId: string }) => void;
    getProduct: ({ companyId }: { companyId: string }) => void;

    createProduct: ({ }: ProductInputType) => Promise<ProductType | null>;

    priceRange: RangeType | null;
    setPriceRange: (value: RangeType) => void
    dateRange: DateRangeType | null;
    setDateRange: (value: DateRangeType) => void
} = {
    loading: true,
    error: false,
    loadMoreData: true,
    isLoading: false,
    products: {},
    fetchProducts: ({ }: { companyId: string }) => { },
    getProduct: ({ }: { companyId: string }) => { },

    createProduct: async ({ }: ProductInputType): Promise<ProductType | null> => { return null },

    priceRange: null,
    setPriceRange: (value: RangeType) => { },
    dateRange: null,
    setDateRange: (value: DateRangeType) => { }
};

type Props = {
    children?: React.ReactNode;
};

const ProductsContext = React.createContext(initialValues);

const useProducts = () => useContext(ProductsContext);

const ProductsProvider: React.FC<Props> = ({ children }) => {
    const [products, setProducts] = useState<{ [id: string]: ProductType[] }>({});

    const [loadMoreData, setLoadMoreData] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const [priceRange, setPriceRange] = useState<RangeType>({});
    const [dateRange, setDateRange] = useState<DateRangeType>({ ...defaultDateRange });


    const createProduct = async (
        {
            name,
            description,
            unit,
            type,
            unitPrice,
            purchaseType,
            companyId,
            chartOfAccountId
        }: ProductInputType
    ): Promise<ProductType | null> => {
        try {
            const productsData = { ...products };
            const newProduct = await createProductAction({
                companyId,
                name,
                description,
                unit,
                unitPrice,
                purchaseType,
                type,
                chartOfAccountId
            });
            productsData[companyId] = [newProduct, ...productsData[companyId]];
            setProducts(productsData);
            return newProduct;
        } catch (e) {
            throw new Error("Error Creating the product");
        }
    };

    const getProduct = useCallback(
        async ({ companyId }: { companyId: string }) => {
            setLoading(true);
            try {
                const newProducts = await fetchProductsByCompanyIdAction({
                    companyId,
                    filter: {
                        ...filter,
                        price: priceRange,
                        dateRange
                    },
                });
                console.log("newProducts", newProducts)
                const productsData = { ...products };
                productsData[companyId] = [...newProducts];
                if (newProducts.length < loadLimit) {
                    setLoadMoreData(false);
                } else {
                    setLoadMoreData(true);
                }
                setProducts(productsData);
                setLoading(false);
            } catch (e) {
                console.log(e);
                setLoading(false);
                setError(true);
            }
        },
        [dateRange, priceRange, products],
    );

    const fetchProducts = useCallback(
        async ({ companyId }: { companyId: string }) => {
            if (!isLoading) {
                setIsLoading(true);
                try {
                    const filter: Filter = {
                        limit: loadLimit,
                    };

                    if (products[companyId] && products[companyId].length > 0) {
                        filter.after = products[companyId][products[companyId].length - 1].id;
                    }
                    const productsData = { ...products };
                    const newProducts = await fetchProductsByCompanyIdAction({
                        companyId,
                        filter: {
                            ...filter,
                            price: priceRange,
                            dateRange
                        },
                    });

                    if (productsData[companyId]) {
                        productsData[companyId] = [...productsData[companyId], ...newProducts];
                    } else {
                        productsData[companyId] = [...newProducts];
                    }

                    setProducts(productsData);
                    if (newProducts.length < loadLimit) {
                        setLoadMoreData(false);
                    }
                    setIsLoading(false);
                } catch (e) {
                    console.log(e);
                    setIsLoading(false);
                    setError(true);
                }
            }
        },
        [dateRange, isLoading, priceRange, products],
    );

    return (
        <ProductsContext.Provider
            value={{
                loading,
                error,
                isLoading,
                loadMoreData,
                products,
                fetchProducts,
                createProduct,
                getProduct,
                priceRange,
                setPriceRange,
                dateRange,
                setDateRange,
            }}
        >
            {children}
        </ProductsContext.Provider>
    );
};

export { ProductsProvider, useProducts };
