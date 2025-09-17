import { Skeleton } from "@/components/ui/skeleton";
export default function AvatarLoadingSkeleton() {
    return (
        <div className="mb-6 hidden text-center md:block">
            <Skeleton className="h-10 w-3/4 mx-auto mb-2 rounded-full" />
            <Skeleton className="h-6 w-2/4 mx-auto rounded-full" />
        </div>
    );
}