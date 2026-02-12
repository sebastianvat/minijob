import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generate a URL-friendly slug from a Romanian text string.
 * Handles diacritics (ă, â, î, ș, ț) and special characters.
 */
export function generateSlug(text: string): string {
  const diacriticsMap: Record<string, string> = {
    'ă': 'a', 'â': 'a', 'î': 'i', 'ș': 's', 'ş': 's', 'ț': 't', 'ţ': 't',
    'Ă': 'a', 'Â': 'a', 'Î': 'i', 'Ș': 's', 'Ş': 's', 'Ț': 't', 'Ţ': 't',
  };
  return text
    .split('')
    .map(c => diacriticsMap[c] || c)
    .join('')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

/**
 * Get the project URL path with a readable slug in the URL.
 * Always uses ID for lookup, slug is decorative for readability.
 */
export function getProjectUrl(project: { slug?: string | null; id: string; title?: string }): string {
  const slug = project.slug || (project.title ? generateSlug(project.title) : null);
  if (slug) {
    return `/project?id=${project.id}&p=${slug}`;
  }
  return `/project?id=${project.id}`;
}
