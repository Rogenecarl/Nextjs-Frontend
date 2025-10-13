import ProviderLayout from "@/components/Provider/layout/ProviderLayout";
import ProviderOperatingHours from "@/components/Provider/schedule/provider-operating-hours";

export default function SchedulePage() {
  return (
    <ProviderLayout>
      <div className="space-y-6">
        <ProviderOperatingHours />
      </div>
    </ProviderLayout>
  );
}
