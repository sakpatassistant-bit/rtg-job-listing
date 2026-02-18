import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string | null): string {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatSalary(salary: string | null): string {
  if (!salary) return 'ตามตกลง';
  return salary;
}

export function isClosingSoon(closingDate: string | null): boolean {
  if (!closingDate) return false;
  
  const date = new Date(closingDate);
  const now = new Date();
  const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  return diffDays <= 7 && diffDays >= 0;
}

export function daysUntilClosing(closingDate: string | null): number | null {
  if (!closingDate) return null;
  
  const date = new Date(closingDate);
  const now = new Date();
  const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  return diffDays >= 0 ? diffDays : null;
}
