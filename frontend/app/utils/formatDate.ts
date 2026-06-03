import { format } from "date-fns";

export const formatDate = (value: string | null | undefined, fmt: string) => {
  if (!value) return '—';
  const date = new Date(value);
  if (isNaN(date.getTime())) return '—';
  return format(date, fmt);
};
