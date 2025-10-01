import { CategoryProps } from "@/types/types";

export interface MarkerProps {
  categoryId: number | undefined;
  categories: CategoryProps[];
}

// Get category data by ID
export const getCategoryData = (
  categoryId: number | undefined,
  categories: CategoryProps[]
) => {
  const category = categories.find((c) => c.id === categoryId);
  return {
    color: category?.color || "#6B7280",
    icon: category?.icon || "📍",
    name: category?.name || "Healthcare Provider",
  };
};

// Create custom marker element with category-specific styling
export const createCustomMarker = (
  categoryId: number | undefined,
  categories: CategoryProps[]
): HTMLDivElement => {
  const { color, icon } = getCategoryData(categoryId, categories);
  const markerElement = document.createElement("div");
  markerElement.className = "custom-marker";

  // Create the marker with modern design using category icon and pointer
  markerElement.innerHTML = `
    <div class="marker-container" style="
      position: relative;
      width: 32px;
      height: 42px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
    ">
      <!-- Main marker body -->
      <div class="marker-body" style="
        width: 32px;
        height: 32px;
        background: ${color};
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.1);
        position: relative;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2;
      ">
        <!-- Category Icon -->
        <div class="marker-icon" style="
          font-size: 14px;
          color: white;
          font-weight: 600;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
          line-height: 1;
        ">${icon}</div>
      </div>
      
      <!-- Pointer/Tail -->
      <div class="marker-pointer" style="
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 8px solid ${color};
        position: relative;
        top: -2px;
        z-index: 1;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
      "></div>
      
      <!-- Pulse animation ring -->
      <div class="marker-pulse" style="
        position: absolute;
        top: -1px;
        left: -1px;
        width: 34px;
        height: 34px;
        border: 1px solid ${color};
        border-radius: 50%;
        opacity: 0.3;
        animation: markerPulse 2.5s infinite;
        z-index: 0;
      "></div>
    </div>
  `;

  // Add hover effects
  const markerBody = markerElement.querySelector(".marker-body") as HTMLElement;
  const markerPointer = markerElement.querySelector(
    ".marker-pointer"
  ) as HTMLElement;

  if (markerBody && markerPointer) {
    markerElement.addEventListener("mouseenter", () => {
      markerBody.style.transform = "scale(1.15)";
      markerBody.style.boxShadow =
        "0 4px 16px rgba(0, 0, 0, 0.2), 0 2px 6px rgba(0, 0, 0, 0.15)";
      markerPointer.style.transform = "scale(1.1)";
    });

    markerElement.addEventListener("mouseleave", () => {
      markerBody.style.transform = "scale(1)";
      markerBody.style.boxShadow =
        "0 2px 8px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.1)";
      markerPointer.style.transform = "scale(1)";
    });
  }

  return markerElement;
};

// Marker styles that need to be injected into the document
export const markerStyles = `
  @keyframes markerPulse {
    0% {
      transform: scale(1);
      opacity: 0.3;
    }
    50% {
      transform: scale(1.3);
      opacity: 0.05;
    }
    100% {
      transform: scale(1);
      opacity: 0.3;
    }
  }
  
  .custom-marker .marker-body {
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .custom-marker .marker-pointer {
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .custom-marker:hover .marker-body {
    transform: scale(1.15) !important;
  }
  
  .custom-marker:hover .marker-pointer {
    transform: scale(1.1) !important;
  }
  
  .custom-marker .marker-pulse {
    animation: markerPulse 2.5s infinite;
  }
  
  /* Ensure marker is properly positioned */
  .custom-marker {
    transform-origin: center bottom;
  }
`;
