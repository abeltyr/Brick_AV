'use client'

import { createProductAction } from '@/lib/data/products/create';
import { fetchProductsByCompanyIdAction } from '@/lib/data/products/fetchByCompanyId';
import { filter, Filter, loadLimit } from '@/types/shared';
import React, { useCallback, useContext, useState } from "react";
import { DateRangeType, RangeType } from '@/types/shared';
import { secondsInADay } from '@/lib/utils/calendar/date';
import { ProductInputType, ProductType } from '@/types/product';


const initialValues: {
    products: { [id: string]: ProductType[] };
    loadMoreData: boolean;
    fetchingProducts: boolean;
    priceRange: RangeType;
    initialLoading: boolean;
    dateRange: DateRangeType;
    createProduct: ({ }: ProductInputType) => Promise<ProductType | null>;
    fetchProducts: ({ companyId }: { companyId: string }) => void;
    getProduct: ({ companyId }: { companyId: string }) => void;
    setPriceRange: (value: RangeType) => void
    setDateRange: (value: DateRangeType) => void
} = {
    products: {},
    loadMoreData: true,
    fetchingProducts: true,
    initialLoading: true,
    priceRange: {},
    dateRange: {
        startDate: new Date(new Date().getTime() - secondsInADay * 1000),
        endDate: new Date(),
    },
    createProduct: async ({ }: ProductInputType): Promise<ProductType | null> => { return null },
    fetchProducts: ({ }: { companyId: string }) => { },
    getProduct: ({ }: { companyId: string }) => { },
    setPriceRange: (value: RangeType) => { },
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
    const [fetchingProducts, setFetchingProducts] = useState<boolean>(false);
    const [initialLoading, setInitialLoading] = useState<boolean>(true);
    const [priceRange, setPriceRange] = useState<RangeType>({});

    const [dateRange, setDateRange] = useState<DateRangeType>({
        startDate: new Date(new Date().getTime() - secondsInADay * 1000),
        endDate: new Date(),
    });

    const createProduct = async (
        {
            name,
            description,
            unit,
            type,
            unitPrice,
            purchaseType,
            companyId
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
            setInitialLoading(true);
            try {
                const newProducts = await fetchProductsByCompanyIdAction({
                    companyId,
                    filter: {
                        ...filter,
                        price: priceRange,
                        dateRange
                    },
                });
                const productsData = { ...products };
                productsData[companyId] = [...newProducts];
                if (newProducts.length < loadLimit) {
                    setLoadMoreData(false);
                } else {
                    setLoadMoreData(true);
                }
                setProducts(productsData);
            } catch (e) {
                console.log(e);
            }
            setInitialLoading(false);
        },
        [dateRange, priceRange, products],
    );

    const fetchProducts = useCallback(
        async ({ companyId }: { companyId: string }) => {
            if (!fetchingProducts) {
                setFetchingProducts(true);
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
                } catch (e) {
                    console.log(e);
                    alert("e");
                }
                setFetchingProducts(false);
            }
        },
        [fetchingProducts, products, priceRange, dateRange],
    );

    return (
        <ProductsContext.Provider
            value={{
                products,
                initialLoading,
                loadMoreData,
                fetchingProducts,
                fetchProducts,
                createProduct,
                getProduct,
                priceRange,
                setPriceRange,
                dateRange,
                setDateRange
            }}
        >
            {children}
        </ProductsContext.Provider>
    );
};

export { ProductsProvider, useProducts };
