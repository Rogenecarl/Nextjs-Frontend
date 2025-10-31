"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  MoreHorizontal,
  Plus,
  Edit,
  Trash2,
  Package,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  type Service,
  type ServiceData,
} from "@/hooks/useProviderServicesMutation";
import { toast } from "sonner";
import { UseMutationResult } from "@tanstack/react-query";
import {
  ProviderServicesTablePagination,
  type PaginationData,
} from "./provider-services-table-pagination";

interface ProviderServicesTableProps {
  services: Service[];
  pagination?: PaginationData;
  isLoading: boolean;
  error: any;
  currentPage: number;
  onPageChange: (page: number) => void;
  onServiceClick?: (service: Service) => void;
  createMutation: UseMutationResult<any, Error, ServiceData>;
  updateMutation: UseMutationResult<
    any,
    Error,
    { id: number; data: Partial<ServiceData> }
  >;
  deleteMutation: UseMutationResult<any, Error, number>;
}

export function ProviderServicesTable({
  services,
  pagination,
  currentPage,
  onPageChange,
  onServiceClick,
  createMutation,
  updateMutation,
  deleteMutation,
}: ProviderServicesTableProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState<Service | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState<Service | null>(
    null
  );

  // Form state
  const [formData, setFormData] = useState<ServiceData>({
    name: "",
    description: "",
    price_min: 0,
    price_max: 0,
    is_active: true,
    // sort_order: 0,
  });

  // Form handlers
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price_min: 0,
      price_max: 0,
      is_active: true,
      // sort_order: 0,
    });
  };

  const handleCreateService = async () => {
    if (!formData.name.trim()) {
      toast.error("Service name is required");
      return;
    }

    if (formData.price_min < 0 || formData.price_max < 0) {
      toast.error("Prices cannot be negative");
      return;
    }

    if (formData.price_max < formData.price_min) {
      toast.error(
        "Maximum price must be greater than or equal to minimum price"
      );
      return;
    }

    try {
      await createMutation.mutateAsync(formData);
      setShowCreateDialog(false);
      resetForm();
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  const handleUpdateService = async () => {
    if (!showEditDialog) return;

    if (!formData.name.trim()) {
      toast.error("Service name is required");
      return;
    }

    if (formData.price_min < 0 || formData.price_max < 0) {
      toast.error("Prices cannot be negative");
      return;
    }

    if (formData.price_max < formData.price_min) {
      toast.error(
        "Maximum price must be greater than or equal to minimum price"
      );
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id: showEditDialog.id,
        data: formData,
      });
      setShowEditDialog(null);
      resetForm();
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  const handleDeleteService = async () => {
    if (!showDeleteDialog) return;

    try {
      await deleteMutation.mutateAsync(showDeleteDialog.id);
      setShowDeleteDialog(null);
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  const openEditDialog = (service: Service) => {
    setFormData({
      name: service.name,
      description: service.description || "",
      price_min: service.price_min,
      price_max: service.price_max,
      is_active: service.is_active,
      // sort_order: service.sort_order,
    });
    setShowEditDialog(service);
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-PH', { 
      minimumFractionDigits: 0, 
      maximumFractionDigits: 0 
    });
  };

  const handlePriceChange = (
    field: "price_min" | "price_max",
    value: string
  ) => {
    const numericValue = parseInt(value) || 0;
    setFormData((prev) => ({ ...prev, [field]: numericValue }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Your Services</h2>
          <p className="text-gray-600 mt-1">
            Manage your service catalog and pricing
          </p>
        </div>
        <Button
          onClick={() => setShowCreateDialog(true)}
          className="bg-cyan-500 hover:bg-cyan-600 text-white shadow-sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Service
        </Button>
      </div>

      {/* Services Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        {/* Desktop Table */}
        <div className="hidden lg:block">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-200 bg-gray-50/50 hover:bg-gray-50/50">
                <TableHead className="text-gray-700 font-semibold py-4 px-6">
                  Service Name
                </TableHead>
                <TableHead className="text-gray-700 font-semibold py-4">
                  Description
                </TableHead>
                <TableHead className="text-gray-700 font-semibold py-4">
                  Price Range
                </TableHead>
                <TableHead className="text-gray-700 font-semibold py-4">
                  Status
                </TableHead>
                {/* <TableHead className="text-gray-700 font-semibold py-4">
                  Sort Order
                </TableHead> */}
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => (
                <TableRow
                  key={service.id}
                  className="hover:bg-gray-50/50 transition-colors cursor-pointer border-b border-gray-100 last:border-0"
                  onClick={() => onServiceClick?.(service)}
                >
                  <TableCell className="py-4 px-6">
                    <div className="font-semibold text-gray-900">
                      {service.name}
                    </div>
                  </TableCell>

                  <TableCell className="py-4">
                    <div className="text-gray-600 max-w-xs truncate">
                      {service.description || "No description"}
                    </div>
                  </TableCell>

                  <TableCell className="py-4">
                    <div className="font-semibold text-gray-900">
                      ₱{formatPrice(service.price_min)} - ₱
                      {formatPrice(service.price_max)}
                    </div>
                  </TableCell>

                  <TableCell className="py-4">
                    <Badge
                      variant="outline"
                      className={cn(
                        "font-semibold px-3 py-1",
                        service.is_active
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-gray-50 text-gray-700 border-gray-200"
                      )}
                    >
                      {service.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>

                  {/* <TableCell className="py-4">
                    <div className="text-gray-600">{service.sort_order}</div>
                  </TableCell> */}

                  <TableCell
                    className="py-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem
                          onClick={() => openEditDialog(service)}
                          className="text-blue-600 focus:text-blue-700 focus:bg-blue-50"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Service
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setShowDeleteDialog(service)}
                          className="text-rose-600 focus:text-rose-700 focus:bg-rose-50"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Service
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden">
          <div className="space-y-3 p-4">
            {services.map((service) => (
              <div
                key={service.id}
                className="border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-gray-300 transition-all cursor-pointer bg-white"
                onClick={() => onServiceClick?.(service)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="font-semibold text-gray-900 flex-1 truncate pr-2">
                    {service.name}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      asChild
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-gray-100"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem
                        onClick={() => openEditDialog(service)}
                        className="text-blue-600 focus:text-blue-700 focus:bg-blue-50"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Service
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setShowDeleteDialog(service)}
                        className="text-rose-600 focus:text-rose-700 focus:bg-rose-50"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Service
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {service.description && (
                  <div className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {service.description}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="font-semibold text-gray-900">
                    ₱{formatPrice(service.price_min)} - ₱
                    {formatPrice(service.price_max)}
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      "font-semibold px-2 py-1 text-xs",
                      service.is_active
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-gray-50 text-gray-700 border-gray-200"
                    )}
                  >
                    {service.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {services.length === 0 && (
          <div className="text-center py-16 px-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <Package className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No services found
            </h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
              You haven't created any services yet. Add your first service to
              get started.
            </p>
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="bg-cyan-500 hover:bg-cyan-600 text-white shadow-sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Service
            </Button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && (
        <ProviderServicesTablePagination
          pagination={pagination}
          currentPage={currentPage}
          onPageChange={onPageChange}
        />
      )}

      {/* Create/Edit Service Dialog */}
      <Dialog
        open={showCreateDialog || !!showEditDialog}
        onOpenChange={(open) => {
          if (!open) {
            setShowCreateDialog(false);
            setShowEditDialog(null);
            resetForm();
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-cyan-100">
                {showEditDialog ? (
                  <Edit className="h-5 w-5 text-cyan-600" />
                ) : (
                  <Plus className="h-5 w-5 text-cyan-600" />
                )}
              </div>
              <DialogTitle className="text-xl">
                {showEditDialog ? "Edit Service" : "Add New Service"}
              </DialogTitle>
            </div>
            <DialogDescription className="text-gray-600">
              {showEditDialog
                ? "Update your service details and pricing."
                : "Create a new service for your customers to book."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Service Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="e.g., Haircut, Massage, Consultation"
                className="border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Describe your service..."
                className="resize-none h-20 border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price_min">Min Price (₱) *</Label>
                <Input
                  id="price_min"
                  type="number"
                  step="1"
                  min="0"
                  value={formData.price_min}
                  onChange={(e) =>
                    handlePriceChange("price_min", e.target.value)
                  }
                  placeholder="0"
                  className="border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price_max">Max Price (₱) *</Label>
                <Input
                  id="price_max"
                  type="number"
                  step="1"
                  min="0"
                  value={formData.price_max}
                  onChange={(e) =>
                    handlePriceChange("price_max", e.target.value)
                  }
                  placeholder="0"
                  className="border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* <div className="space-y-2">
                <Label htmlFor="sort_order">Sort Order</Label>
                <Input
                  id="sort_order"
                  type="number"
                  min="0"
                  value={formData.sort_order}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      sort_order: parseInt(e.target.value) || 0,
                    }))
                  }
                  placeholder="0"
                  className="border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                />
              </div> */}
              <div className="space-y-2">
                <Label htmlFor="is_active">Status</Label>
                <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, is_active: checked }))
                    }
                  />
                  <Label htmlFor="is_active" className="text-sm">
                    {formData.is_active ? "Active" : "Inactive"}
                  </Label>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateDialog(false);
                setShowEditDialog(null);
                resetForm();
              }}
              disabled={createMutation.isPending || updateMutation.isPending}
              className="border-gray-300"
            >
              Cancel
            </Button>
            <Button
              onClick={
                showEditDialog ? handleUpdateService : handleCreateService
              }
              disabled={createMutation.isPending || updateMutation.isPending}
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              {createMutation.isPending || updateMutation.isPending
                ? showEditDialog
                  ? "Updating..."
                  : "Creating..."
                : showEditDialog
                ? "Update Service"
                : "Create Service"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!showDeleteDialog}
        onOpenChange={() => setShowDeleteDialog(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-rose-100">
                <AlertCircle className="h-5 w-5 text-rose-600" />
              </div>
              <DialogTitle className="text-xl">Delete Service</DialogTitle>
            </div>
            <DialogDescription className="text-gray-600">
              Are you sure you want to delete "{showDeleteDialog?.name}"? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(null)}
              disabled={deleteMutation.isPending}
              className="border-gray-300"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteService}
              disabled={deleteMutation.isPending}
              className="bg-rose-600 hover:bg-rose-700"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete Service"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
