import { assembleGuide, type GristRecord } from './map.ts'
import type { GuideData } from '../guide/types.ts'

type GristRecordsResponse = {
  records: GristRecord[]
}

export type GristFetchConfig = {
  baseUrl: string
  docId: string
  apiKey?: string
}

async function fetchTable(
  config: GristFetchConfig,
  tableId: string,
): Promise<GristRecord[]> {
  const url = `${config.baseUrl.replace(/\/$/, '')}/docs/${config.docId}/tables/${tableId}/records`
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (config.apiKey) {
    headers.Authorization = `Bearer ${config.apiKey}`
  }
  const res = await fetch(url, { headers })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Grist ${tableId}: HTTP ${res.status} — ${body.slice(0, 300)}`)
  }
  const json = (await res.json()) as GristRecordsResponse
  return json.records ?? []
}

export async function fetchGuideData(config: GristFetchConfig): Promise<GuideData> {
  const [thematiquesRows, pagesRows, fichesRows] = await Promise.all([
    fetchTable(config, 'Thematiques'),
    fetchTable(config, 'Pages_cadre'),
    fetchTable(config, 'Fiches'),
  ])
  return assembleGuide(thematiquesRows, pagesRows, fichesRows)
}
