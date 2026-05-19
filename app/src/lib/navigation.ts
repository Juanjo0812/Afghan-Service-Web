import type { LangCode } from '@/domain/language'

export function localizePath(path: string, lang: LangCode): string {
  if (lang === 'en') return path
  return `/${lang}${path}`
}
