import ProviderLayout from "@/components/Provider/layout/ProviderLayout";

export default function ServicesPage() {
  return (
    <ProviderLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Services</h1>
          <p className="text-gray-600 mt-1">Manage your service catalog and pricing</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-600">Services management coming soon...</p>
        </div>
      </div>
    </ProviderLayout>
  );
}