'use client'


import { fetchProductsByCompanyIdAction } from '@/lib/data/products/fetchByCompanyId';
import { Filter, loadLimit } from '@/types/shared';
import { ProductType } from '@/types/product';
import React, { useCallback, useContext, useState } from "react";


const initialValues: {
    products: { [id: string]: ProductType[] },
    loadMoreData: boolean,
    setupProductsData: ({ dataProducts, companyId }: { dataProducts: ProductType[], companyId: string }) => void,
    fetchProducts: ({ companyId }: { companyId: string }) => void,
    fetchingProducts: boolean,
} = {
    products: {},
    loadMoreData: true,
    setupProductsData: ({ }: { dataProducts: ProductType[], companyId: string }) => { },
    fetchProducts: ({ }: { companyId: string }) => { },
    fetchingProducts: true,
};

type Props = {
    children?: React.ReactNode;
};

const ProductsContext = React.createContext(initialValues);

const useProducts = () => useContext(ProductsContext);

const ProductsProvider: React.FC<Props> = ({ children }) => {
    const [products, setProducts] = useState<{ [id: string]: ProductType[] }>({})
    const [loadMoreData, setLoadMoreData] = useState<boolean>(true)
    const [fetchingProducts, setFetchingProducts] = useState<boolean>(true)



    const setupProductsData = ({ dataProducts, companyId }: { dataProducts: ProductType[], companyId: string }) => {

        const productsData = { ...products }

        productsData[companyId] = dataProducts;

        setProducts(productsData);

        if (dataProducts.length < loadLimit) {
            setLoadMoreData(false)
        } else {
            setLoadMoreData(true)
        }
        setFetchingProducts(false);
    };



    const fetchProducts = useCallback(
        async ({ companyId }: { companyId: string }) => {

            if (fetchingProducts) return;

            setFetchingProducts(true);
            try {
                const filter: Filter = {
                    limit: loadLimit,
                }

                if (products[companyId].length > 0) {
                    filter.after = products[companyId][length - 1].id
                }


                const newProducts = await fetchProductsByCompanyIdAction({
                    companyId,
                    filter
                });


                const productsData = { ...products };
                if (productsData[companyId])
                    productsData[companyId] = [...productsData[companyId], ...newProducts]
                else {
                    productsData[companyId] = [...newProducts]
                }

                setProducts(productsData);
                if (newProducts.length < loadLimit) {
                    setLoadMoreData(false)
                }
            } catch (e) {

            }

            setFetchingProducts(false);
        },
        [products, fetchingProducts],
    );


    return (
        <ProductsContext.Provider
            value={{
                products,
                loadMoreData,
                setupProductsData,
                fetchingProducts,
                fetchProducts
            }}
        >
            {children}
        </ProductsContext.Provider>
    );
};

export { ProductsProvider, useProducts };