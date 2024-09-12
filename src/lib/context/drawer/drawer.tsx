'use client'

import React, { useContext, useState } from "react";



const initialValues: {
    addVendorDrawer: boolean,
    setAddVendorDrawer: (value: boolean) => void,
    addProductDrawer: boolean,
    setAddProductDrawer: (value: boolean) => void,
    purchaseProductListingDrawer: boolean,
    setPurchaseProductListingDrawer: (value: boolean) => void,
    purchaseVendorListingDrawer: boolean,
    setPurchaseVendorListingDrawer: (value: boolean) => void,
} = {
    addVendorDrawer: false,
    setAddVendorDrawer: (value: boolean) => { },
    addProductDrawer: false,
    setAddProductDrawer: (value: boolean) => { },
    purchaseProductListingDrawer: false,
    setPurchaseProductListingDrawer: (value: boolean) => { },
    purchaseVendorListingDrawer: false,
    setPurchaseVendorListingDrawer: (value: boolean) => { },
};

type Props = {
    children?: React.ReactNode;
};

const DrawerManagerContext = React.createContext(initialValues);

const useDrawerManager = () => useContext(DrawerManagerContext);

const DrawerManagerProvider: React.FC<Props> = ({ children }) => {
    const [addVendorDrawer, setAddVendorDrawer] = useState(false);
    const [addProductDrawer, setAddProductDrawer] = useState(false);
    const [purchaseProductListingDrawer, setPurchaseProductListingDrawer] = useState(false);
    const [purchaseVendorListingDrawer, setPurchaseVendorListingDrawer] = useState(false);


    return (
        <DrawerManagerContext.Provider
            value={{
                addVendorDrawer,
                setAddVendorDrawer,
                addProductDrawer,
                setAddProductDrawer,
                purchaseProductListingDrawer,
                setPurchaseProductListingDrawer,
                purchaseVendorListingDrawer,
                setPurchaseVendorListingDrawer
            }}
        >
            {children}
        </DrawerManagerContext.Provider>
    );
};

export { DrawerManagerProvider, useDrawerManager };