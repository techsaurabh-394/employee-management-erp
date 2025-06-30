import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDate = (date: Date | string | number | undefined | null) => {
  if (!date) return '';
  let d: Date;
  if (date instanceof Date) {
    d = date;
  } else if (typeof date === 'string' || typeof date === 'number') {
    d = new Date(date);
  } else {
    return '';
  }
  if (isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(d);
}

export const formatCurrency = (amount: number, locale = 'en-US', currency = 'USD') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(amount)
}

export const generateId = () => {
  return Math.random().toString(36).substr(2, 9)
}

export const getInitials = (name?: string) => {
  if (!name || typeof name !== 'string') return '';
  return name
    .split(' ')
    .filter(Boolean)
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export const calculateWorkingHours = (checkIn: Date, checkOut: Date) => {
  const diff = checkOut.getTime() - checkIn.getTime()
  return Math.round(diff / (1000 * 60 * 60) * 100) / 100
}