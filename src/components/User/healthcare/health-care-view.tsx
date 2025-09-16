import { ProviderProps, CategoryProps } from "@/types/types";
import UserLayout from "@/components/User/layout/user-layout";
import ProviderCard from "@/components/User/ProviderCard";
import CategoryFilter from "@/components/User/category-filter";
import SearchFiltersCategory from "@/components/User/provider-search-filters";

interface HealthcareViewProps {
    providers: ProviderProps[];
    categories: CategoryProps[];
}

export default function HealthcareView({ providers, categories }: HealthcareViewProps) {
    return (
        <UserLayout>
            <div className="relative container mx-auto px-6">
                <div className="mb-6 hidden text-center md:block">
                    <h1 className="mb-2 text-3xl font-bold text-gray-900">
                        Health Care Services in{' '}
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Digos City</span>
                    </h1>
                    <p className="font-medium text-gray-700">Find the best health care services in Digos City for your needs</p>
                </div>

                <div className="flex flex-wrap gap-3 justify-center mb-6">
                    {/* <CategoryFilters categories={categories} /> */}
                    {categories.map((category) => (
                        <CategoryFilter key={category.id} category={category} />
                    ))}
                </div>

                <div className="mb-6">
                    <SearchFiltersCategory />
                </div>

                <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {providers.map((provider) => (
                        <ProviderCard key={provider.id} provider={provider} />
                    ))}
                </div>
            </div>
        </UserLayout>
    );
}