import DashboardOverview from './dashboard/DashboardOverview';

interface ProviderApprovedDashboardProps {
    provider: {
        id: number;
        business_name: string;
        status: string;
        created_at: string;
    };
}

export default function ProviderApprovedDashboard({ provider }: ProviderApprovedDashboardProps) {
    return <DashboardOverview />;
}
