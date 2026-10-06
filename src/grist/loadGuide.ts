import { fetchGuideData } from './client.ts'
import { fetchGuideDataFromWidget, getGristApi } from './plugin.ts'
import type { GuideData } from '../guide/types.ts'

export type GuideSource = 'widget' | 'api'

export type LoadedGuide = {
  data: GuideData
  source: GuideSource
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = window.setTimeout(() => reject(new Error(label)), ms)
    promise.then(
      (v) => {
        window.clearTimeout(t)
        resolve(v)
      },
      (e: unknown) => {
        window.clearTimeout(t)
        reject(e)
      },
    )
  })
}

function inGristFrame(): boolean {
  try {
    return window.self !== window.top
  } catch {
    return true
  }
}

export async function loadGuideData(): Promise<LoadedGuide> {
  const embedded = inGristFrame()

  if (embedded || getGristApi()) {
    try {
      const data = await withTimeout(
        fetchGuideDataFromWidget(),
        8000,
        'Délai dépassé en lisant le document Grist (widget).',
      )
      return { data, source: 'widget' }
    } catch (e: unknown) {
      if (embedded) {
        throw e instanceof Error ? e : new Error(String(e))
      }
    }
  }

  if (import.meta.env.DEV) {
    const data = await fetchGuideData({
      baseUrl: '/grist',
      docId: import.meta.env.VITE_GRIST_DOC_ID || 'vygR8LGAq3an',
    })
    return { data, source: 'api' }
  }

  throw new Error(
    'Ouvrez cette page comme widget personnalisé dans Grist. GitHub Pages seul n’a pas accès aux tables.',
  )
}
