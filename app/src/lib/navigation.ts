import type { LangCode } from '@/domain/language'

export function localizePath(path: string, lang: LangCode): string {
  if (lang === 'dari') return path
  return `/${lang}${path}`
}
