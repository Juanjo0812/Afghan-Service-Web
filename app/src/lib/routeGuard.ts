import { notFound } from 'next/navigation'
import { LOCALIZED_LANGUAGES, type LocalizedLangCode } from '@/domain/language'

export function assertValidLang(lang: string): LocalizedLangCode {
  if (!LOCALIZED_LANGUAGES.includes(lang as LocalizedLangCode)) {
    notFound()
  }
  return lang as LocalizedLangCode
}
