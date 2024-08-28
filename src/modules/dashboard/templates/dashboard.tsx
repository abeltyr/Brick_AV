import { DashboardNav } from '@/modules/dashboard/components/nav';
import { DetailCard } from '@/modules/dashboard/components/detailCard';
import { SalesOverview } from '../components/salesOverview';
import { PurchaseOverview } from '../components/purchaseOverview';
import PurchaseSection from '../components/purschases';

export default function DashboardTemplate() {

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <DashboardNav />
            <DetailCard />
            <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
                <div className="xl:col-span-2">
                    {/* <SalesOverview /> */}
                    <PurchaseSection />
                </div>
                <PurchaseOverview />
            </div>
        </main>
    );
}

