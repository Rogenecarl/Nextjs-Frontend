import { Skeleton } from "@/components/ui/skeleton";

/**
 * Renders a skeleton loader for the appointment table body.
 * @param {object} props - The component props.
 * @param {number} [props.rows=5] - The number of skeleton rows to display.
 */
export const AppointmentTableSkeleton = ({ rows = 5 }: { rows?: number }) => {
  return (
    <tbody>
      {Array.from({ length: rows }).map((_, index) => (
        <tr key={index}>
          {/* Appointment # */}
          <td className="p-4">
            <Skeleton className="h-4 w-3/4 rounded-md" />
          </td>
          {/* Name */}
          <td className="p-4">
            <Skeleton className="h-4 w-1/2 rounded-md" />
          </td>
          {/* Date & Time */}
          <td className="p-4">
            <Skeleton className="h-4 w-5/6 mb-2 rounded-md" />
            <Skeleton className="h-3 w-1/2 rounded-md" />
          </td>
          {/* Service */}
          <td className="p-4">
            <Skeleton className="h-4 w-3/4 rounded-md" />
          </td>
          {/* Status */}
          <td className="p-4">
            <Skeleton className="h-6 w-20 rounded-full" />
          </td>
          {/* Price */}
          <td className="p-4">
            <Skeleton className="h-4 w-1/3 rounded-md" />
          </td>
        </tr>
      ))}
    </tbody>
  );
};