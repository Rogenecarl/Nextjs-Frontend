import { ProviderProps } from "@/types/types";

interface ProviderCardProps {
    provider: ProviderProps;
}

export default function ProviderCard({ provider }: ProviderCardProps) {
    return (
        <article
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col"
            aria-label={`Healthcare provider: ${provider.healthcare_name}`}
        >
            {/* Cover photo */}
            {provider.cover_photo && (
                <img
                    src={provider.cover_photo}
                    alt={`Cover photo of ${provider.healthcare_name}`}
                    className="w-full h-48 object-cover rounded-t-lg"
                    loading="lazy"
                />
            )}
            <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    {provider.healthcare_name}
                </h2>
                <p className="text-gray-700 mb-4 flex-grow">{provider.description}</p>
                <div className="mb-4 text-sm text-gray-600 space-y-1">
                    <p>
                        <strong>Contact:</strong>{" "}
                        <a
                            href={`tel:${provider.phone_number}`}
                            className="text-blue-600 hover:underline"
                        >
                            {provider.phone_number}
                        </a>{" "}
                        |{" "}
                        <a
                            href={`mailto:${provider.email}`}
                            className="text-blue-600 hover:underline"
                        >
                            {provider.email}
                        </a>
                    </p>
                    <p>
                        <strong>Address:</strong> {provider.address}, {provider.city},{" "}
                        {provider.province}
                    </p>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Services</h3>
                    <ul className="list-disc list-inside space-y-1 max-h-40 overflow-y-auto pr-2">
                        {provider.services.map((service) => (
                            <li key={service.id} className="text-gray-700 text-sm">
                                <span className="font-medium">{service.name}</span> -{" "}
                                {service.description} (
                                <span className="font-semibold">
                                    PHP{service.price_min} - PHP{service.price_max}
                                </span>
                                )
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </article>
    );
}
