import { cn } from "@/lib/utils";

type StatusType =
  | "confirmed"
  | "paid"
  | "partial"
  | "cancelled"
  | "returned"
  | "instock"
  | "lowstock"
  | "outofstock";

const statusStyles: Record<StatusType, string> = {
  confirmed: "bg-status-confirmed-bg text-status-confirmed",
  paid: "bg-status-paid-bg text-status-paid",
  partial: "bg-status-partial-bg text-status-partial",
  cancelled: "bg-status-cancelled-bg text-status-cancelled",
  returned: "bg-status-returned-bg text-status-returned",
  instock: "bg-status-instock-bg text-status-instock",
  lowstock: "bg-status-lowstock-bg text-status-lowstock",
  outofstock: "bg-status-outofstock-bg text-status-outofstock",
};

const statusLabels: Record<StatusType, string> = {
  confirmed: "Confirmed",
  paid: "Paid",
  partial: "Partially Paid",
  cancelled: "Cancelled",
  returned: "Returned",
  instock: "In Stock",
  lowstock: "Low Stock",
  outofstock: "Out of Stock",
};

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  className?: string;
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-badge font-medium",
        statusStyles[status],
        className
      )}
    >
      {label || statusLabels[status]}
    </span>
  );
}

export type { StatusType };
