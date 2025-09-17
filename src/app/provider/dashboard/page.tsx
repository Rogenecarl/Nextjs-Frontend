import ProviderLayout from "@/components/Provider/layout/ProviderLayout";
import WelcomeDashboard from "@/components/Provider/welcome-dashboard";

export default function ProviderDashboardPage() {
    return (
        <ProviderLayout>
            <div>
                <WelcomeDashboard />
            </div>
        </ProviderLayout>
    );
}
