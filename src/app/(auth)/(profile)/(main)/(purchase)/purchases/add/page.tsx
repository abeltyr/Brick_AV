import { AddPurchasesProvider } from '@/lib/context/purchase/addPurchase';
import { AddPurchaseSection } from '@/modules/purchase/templates/add';

export default function Withholding() {
    return (
        <AddPurchasesProvider>
            <AddPurchaseSection />
        </AddPurchasesProvider>
    );
}

