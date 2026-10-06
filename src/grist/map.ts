import type { Fiche, GuideData, PageCadre, Thematique } from '../guide/types.ts'

export type GristRecord = {
  id: number
  fields: Record<string, unknown>
}

export function textField(fields: Record<string, unknown>, key: string): string {
  const v = fields[key]
  if (v == null) return ''
  return String(v)
}

export function intField(fields: Record<string, unknown>, key: string, fallback = 0): number {
  const v = fields[key]
  if (typeof v === 'number' && Number.isFinite(v)) return v
  if (typeof v === 'string' && v.trim() !== '') {
    const n = Number.parseInt(v, 10)
    if (Number.isFinite(n)) return n
  }
  return fallback
}

export function refId(value: unknown): number {
  if (typeof value === 'number') return value
  if (Array.isArray(value) && value[0] === 'L' && typeof value[1] === 'number') {
    return value[1]
  }
  return 0
}

export function columnarToRecords(table: Record<string, unknown>): GristRecord[] {
  const ids = (table.id as number[] | undefined) ?? []
  const keys = Object.keys(table).filter((k) => k !== 'id' && k !== 'manualSort')
  return ids.map((id, i) => ({
    id,
    fields: Object.fromEntries(keys.map((k) => [k, (table[k] as unknown[])[i]])),
  }))
}

export function mapThematique(row: GristRecord): Thematique {
  return {
    id: row.id,
    libelle: textField(row.fields, 'libelle'),
    ordre: intField(row.fields, 'ordre'),
    couleur: textField(row.fields, 'couleur') || '#334155',
  }
}

export function mapPageCadre(row: GristRecord): PageCadre {
  return {
    id: row.id,
    titre: textField(row.fields, 'titre'),
    corps: textField(row.fields, 'corps'),
    ordre: intField(row.fields, 'ordre'),
  }
}

export function mapFiche(row: GristRecord): Fiche {
  const pages = intField(row.fields, 'pages_forcees', 1)
  return {
    id: row.id,
    thematiqueId: refId(row.fields.thematique),
    titreStructure: textField(row.fields, 'titre_structure'),
    sigle: textField(row.fields, 'sigle'),
    preambule: textField(row.fields, 'preambule'),
    descriptionOffre: textField(row.fields, 'description_offre'),
    delaisModalites: textField(row.fields, 'delais_modalites'),
    conditionsAcces: textField(row.fields, 'conditions_acces'),
    implantation: textField(row.fields, 'implantation'),
    horaires: textField(row.fields, 'horaires'),
    apports: textField(row.fields, 'apports'),
    pointsVigilance: textField(row.fields, 'points_vigilance'),
    ordreDansTheme: intField(row.fields, 'ordre_dans_theme'),
    pagesForcees: pages === 2 ? 2 : 1,
  }
}

export function assembleGuide(
  thematiquesRows: GristRecord[],
  pagesRows: GristRecord[],
  fichesRows: GristRecord[],
): GuideData {
  const thematiques = thematiquesRows.map(mapThematique).sort((a, b) => a.ordre - b.ordre)
  const pagesCadre = pagesRows.map(mapPageCadre).sort((a, b) => a.ordre - b.ordre)
  const fiches = fichesRows.map(mapFiche)

  if (thematiques.length === 0 || fiches.length === 0) {
    throw new Error('Grist : tables Thematiques ou Fiches vides.')
  }

  return { thematiques, pagesCadre, fiches }
}
