"use client";
import { useQuery } from "@tanstack/react-query";
import { ProviderProps } from "@/types/types";
import ProviderCard from "@/components/User/ProviderCard";

async function fetchProvider() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/providers`);
    if (!res.ok) {
        throw new Error("Network response was not ok");
    }
    const json = await res.json();
    console.log("API response:", json);
    return json.providers as ProviderProps[];
}
export default function Healthcare() {
    const { data, error, isLoading, isError } = useQuery<ProviderProps[]>({
        queryKey: ["providers"],
        queryFn: fetchProvider,
    });
    if (isLoading)
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="text-gray-500 text-lg">Loading providers...</span>
            </div>
        );

    if (isError)
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="text-red-600 text-lg">Error: {error?.message}</span>
            </div>
        );
    if (!Array.isArray(data)) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="text-yellow-600 text-lg">Unexpected data format</span>
            </div>
        );
    }
    return (
        <main className="max-w-7xl mx-auto px-6 py-12">
            <header className="mb-12 text-center">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                    Healthcare Providers
                </h1>
                <p className="text-gray-600 max-w-xl mx-auto">
                    Discover trusted healthcare providers and their services in your area.
                </p>
            </header>
            <section className="grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {data.map((provider) => (
                    <ProviderCard key={provider.id} provider={provider} />
                ))}
            </section>
        </main>
    );
}
