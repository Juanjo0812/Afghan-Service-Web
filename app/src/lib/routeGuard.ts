import { notFound } from 'next/navigation'
import { isValidLang, type LangCode } from '@/domain/language'

export function assertValidLang(lang: string): LangCode {
  if (!isValidLang(lang)) {
    notFound()
  }
  return lang
}
