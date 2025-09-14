import RoleSelection from "@/components/Auth/select-role";

export default function RolePage() {
    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-3xl">
                <RoleSelection />
            </div>
        </div>
    )
}