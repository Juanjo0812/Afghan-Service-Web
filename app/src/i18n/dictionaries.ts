import type { Namespace } from '@/lib/i18n'

export async function getDictionary(lang: string, namespace: Namespace) {
  const module = await import(`@/locales/${lang}/${namespace}.json`)
  return module.default as Record<string, unknown>
}
