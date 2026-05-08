import type { LangCode } from './direction'

export async function loadData<T>(lang: LangCode, baseFileName: string): Promise<T> {
  try {
    const module = await import(`../data/${baseFileName}.${lang}.json`)
    return module.default as T
  } catch {
    const fallback = await import(`../data/${baseFileName}.json`)
    return fallback.default as T
  }
}
