import { clsx, type ClassValue } from "clsx"
import { endOfDay, startOfDay, subDays } from "date-fns";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toLocalMoney(amount: number) {
  const formatted = new Intl.NumberFormat("vn-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
  return formatted;
}

export const rangeOptions = {
  lastWeek: {
    label: "Last 7 days",
    startDate: startOfDay(subDays(new Date(), 6)),
    endDate: endOfDay(new Date()),
    time: 7,
  },
  lastMonth: {
    label: "Last 30 days",
    startDate: startOfDay(subDays(new Date(), 29)),
    endDate: endOfDay(new Date()),
    time: 30,
  },
  lastYear: {
    label: "Last 365 days",
    startDate: startOfDay(subDays(new Date(), 364)),
    endDate: endOfDay(new Date()),
    time: 365,
  },
  allTime: {
    label: "All time",
    startDate: null,
    endDate: endOfDay(new Date()),
    time: 0,
  }
}