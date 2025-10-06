import ProviderLayout from "@/components/Provider/layout/ProviderLayout";

export default function DocumentsPage() {
  return (
    <ProviderLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
          <p className="text-gray-600 mt-1">Manage verification and compliance documents</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-600">Document management coming soon...</p>
        </div>
      </div>
    </ProviderLayout>
  );
}