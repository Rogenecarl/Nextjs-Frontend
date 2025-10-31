"use client";

import { useState } from "react";
import { ProviderServicesTable } from "@/components/Provider/services/provider-services-table";
import { ProviderServicesTableSkeleton } from "@/components/Provider/services/provider-services-table-skeleton";
import {
  useProviderServices,
  useCreateService,
  useUpdateService,
  useDeleteService,
  type Service,
} from "@/hooks/useProviderServicesMutation";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function ServicesPage() {
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch services data
  const {
    data: servicesData,
    isLoading,
    error,
    refetch,
  } = useProviderServices(currentPage);

  // Mutations
  const createMutation = useCreateService();
  const updateMutation = useUpdateService();
  const deleteMutation = useDeleteService();

  const services = servicesData?.services?.data || [];
  const pagination = servicesData?.services;

  const handleServiceClick = (service: Service) => {
    // Handle service click - could navigate to detail page or open modal
    console.log("Service clicked:", service);
  };

  // Show loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-6">
        <ProviderServicesTableSkeleton />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Failed to load services
          </h3>
          <p className="text-gray-500 mb-4">
            There was an error loading your services. Please try again.
          </p>
          <Button onClick={() => refetch()} variant="outline">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProviderServicesTable
        services={services}
        pagination={pagination}
        isLoading={isLoading}
        error={error}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onServiceClick={handleServiceClick}
        createMutation={createMutation}
        updateMutation={updateMutation}
        deleteMutation={deleteMutation}
      />
    </div>
  );
}
