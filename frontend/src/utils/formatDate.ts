import { format } from "date-fns";

export function formatDateTime(date: Date | string): string {
  return format(new Date(date), "dd MMM yyyy, h:mm a");
}

export function formatDate(date: Date | string): string {
  return format(new Date(date), "dd MMM yyyy");
}
