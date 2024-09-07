'use client'

import { createProductAction } from '@/lib/data/products/create';
import { fetchProductsByCompanyIdAction } from '@/lib/data/products/fetchByCompanyId';
import { filter, Filter, loadLimit } from '@/types/shared';
import { ProductType } from '@/types/product';
import React, { useCallback, useContext, useState } from "react";
import { ProductUnit, PurchaseType, ProductType as ProductInputType } from '@prisma/client';
import Decimal from 'decimal.js';

const initialValues: {
    products: { [id: string]: ProductType[] };
    loadMoreData: boolean;
    setupProductsData: ({ dataProducts, companyId }: { dataProducts: ProductType[], companyId: string }) => void;
    fetchProducts: ({ companyId }: { companyId: string }) => void;
    getProduct: ({ companyId }: { companyId: string }) => void;
    fetchingProducts: boolean;
    initialLoading: boolean;
    createProduct: ({ }: {
        name: string;
        description?: string;
        unit: ProductUnit,
        unitPrice: Decimal;
        purchaseType: PurchaseType;
        type: ProductInputType,
        companyId: string;
    }) => Promise<ProductType | null>;
} = {
    products: {},
    loadMoreData: true,
    setupProductsData: ({ }: { dataProducts: ProductType[], companyId: string }) => { },
    fetchProducts: ({ }: { companyId: string }) => { },
    getProduct: ({ }: { companyId: string }) => { },
    fetchingProducts: true,
    initialLoading: true,
    createProduct: async ({ }: {
        name: string;
        description?: string;
        unit: ProductUnit,
        unitPrice: Decimal;
        purchaseType: PurchaseType;
        type: ProductInputType,
        companyId: string;
    }): Promise<ProductType | null> => { return null },
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

    const setupProductsData = ({ dataProducts, companyId }: { dataProducts: ProductType[], companyId: string }) => {
        const productsData = { ...products };
        productsData[companyId] = dataProducts;
        setProducts(productsData);

        if (dataProducts.length < loadLimit) {
            setLoadMoreData(false);
        } else {
            setLoadMoreData(true);
        }
        setFetchingProducts(false);
    };

    const createProduct = async ({ name, description, unit, type, unitPrice, purchaseType, companyId }: {
        name: string;
        description?: string;
        unit: ProductUnit,
        unitPrice: Decimal;
        purchaseType: PurchaseType;
        type: ProductInputType,
        companyId: string;
    }): Promise<ProductType | null> => {
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
                    filter,
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
            } catch (e) {
                console.log(e);
            }
            setInitialLoading(false);
        },
        [products],
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
                        filter,
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
        [products, fetchingProducts],
    );

    return (
        <ProductsContext.Provider
            value={{
                products,
                initialLoading,
                loadMoreData,
                setupProductsData,
                fetchingProducts,
                fetchProducts,
                createProduct,
                getProduct,
            }}
        >
            {children}
        </ProductsContext.Provider>
    );
};

export { ProductsProvider, useProducts };
