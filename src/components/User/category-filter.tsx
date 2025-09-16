import { CategoryProps } from "@/types/types";
import { Button } from "../ui/button";

interface CategoryFilterProps {
    category: CategoryProps;
}


export default function CategoryFilter({ category }: CategoryFilterProps) {
    return (
        <div>
            {/* Display Category Filters */}
            <Button
                key={category.id}
                variant="outline"
                aria-label={`Filter by ${category.name}`}
            >
                {category.icon && (
                    <span className="text-lg" role="img" aria-hidden="true">
                        {category.icon}
                    </span>
                )}
                <span>{category.name}</span>
                {category.count > 0 && (
                    <span
                        className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-medium g-blue-600 text-white" : "bg-gray-200 text-gray-700"
                            }`}
                        aria-label={`${category.count} items`} >
                        {category.count}
                    </span>
                )}
            </Button>

        </div>
    );
}
