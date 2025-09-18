import { CategoryProps } from "@/types/types";
import { Button } from "../ui/button";

interface CategoryFilterProps {
    category: CategoryProps;
    onSelect?: (categoryId: number) => void;
    isActive?: boolean; // <-- Add isActive pro
}

export default function CategoryFilter({ category, onSelect, isActive }: CategoryFilterProps) {

    const handleCategoryClick = () => {
        onSelect?.(category.id);
    }
    return (
        <Button
            onClick={handleCategoryClick}
            // Use variant="default" (solid) for active, "outline" for inactive
            variant={isActive ? "default" : "outline"}
            aria-label={`Filter by ${category.name}`}
            className="flex items-center gap-2"
        >
            {category.icon && (
                <span className="text-lg" role="img" aria-hidden="true">
                    {category.icon}
                </span>
            )}
            <span>{category.name}</span>
            {category.count > 0 && (
                <span
                    className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-medium ${category.count > 0 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    aria-label={`${category.count} items`}
                >
                    {category.count}
                </span>
            )}
        </Button>
    );
}
