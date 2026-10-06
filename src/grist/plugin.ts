import { assembleGuide, columnarToRecords } from './map.ts'
import type { GuideData } from '../guide/types.ts'

export type GristPluginApi = {
  ready: (options?: { requiredAccess?: 'none' | 'read table' | 'full' }) => void
  docApi: {
    fetchTable: (tableId: string) => Promise<Record<string, unknown>>
  }
}

export function getGristApi(): GristPluginApi | undefined {
  const g = (window as unknown as { grist?: GristPluginApi }).grist
  if (!g?.docApi?.fetchTable) return undefined
  return g
}

let readyCalled = false

export async function fetchGuideDataFromWidget(): Promise<GuideData> {
  const grist = getGristApi()
  if (!grist) {
    throw new Error('API widget Grist indisponible.')
  }
  if (!readyCalled) {
    grist.ready({ requiredAccess: 'read table' })
    readyCalled = true
  }
  const [thematiquesTable, pagesTable, fichesTable] = await Promise.all([
    grist.docApi.fetchTable('Thematiques'),
    grist.docApi.fetchTable('Pages_cadre'),
    grist.docApi.fetchTable('Fiches'),
  ])
  return assembleGuide(
    columnarToRecords(thematiquesTable),
    columnarToRecords(pagesTable),
    columnarToRecords(fichesTable),
  )
}
