import ProviderNavbar from "../provider-navbar";

export default function ProviderLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-background">
            <ProviderNavbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                {children}
            </main>
        </div>
    );
}
