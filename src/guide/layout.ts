import type { Fiche, GuideData, SommaireEntry, Thematique } from './types.ts'

export const COVER_PAGES = 1
export const SOMMAIRE_PAGES = 1

export function dash(value: string | undefined | null): string {
  const t = (value ?? '').trim()
  return t.length > 0 ? t : '—'
}

export function thematiqueOf(fiche: Fiche, thematiques: Thematique[]): Thematique {
  const found = thematiques.find((t) => t.id === fiche.thematiqueId)
  if (!found) {
    return {
      id: 0,
      libelle: 'Thématique non renseignée',
      ordre: 99,
      couleur: '#334155',
    }
  }
  return found
}

export function fichesTriees(data: GuideData): Fiche[] {
  const themeOrdre = new Map(data.thematiques.map((t) => [t.id, t.ordre]))
  return [...data.fiches].sort((a, b) => {
    const oa = themeOrdre.get(a.thematiqueId) ?? 99
    const ob = themeOrdre.get(b.thematiqueId) ?? 99
    if (oa !== ob) return oa - ob
    return a.ordreDansTheme - b.ordreDansTheme
  })
}

export function fichePageCount(fiche: Fiche): 1 | 2 {
  return fiche.pagesForcees === 2 ? 2 : 1
}

export function cadrePageCount(data: GuideData): number {
  return Math.max(data.pagesCadre.length, 0)
}

export function firstFicheGlobalPage(data: GuideData): number {
  return COVER_PAGES + cadrePageCount(data) + SOMMAIRE_PAGES + 1
}

export function sommaireEntries(data: GuideData): SommaireEntry[] {
  let page = firstFicheGlobalPage(data)
  return fichesTriees(data).map((fiche) => {
    const theme = thematiqueOf(fiche, data.thematiques)
    const pagesFiche = fichePageCount(fiche)
    const entry: SommaireEntry = {
      titre: fiche.titreStructure,
      page,
      thematique: theme.libelle,
      couleur: theme.couleur,
      pagesFiche,
    }
    page += pagesFiche
    return entry
  })
}

export function totalPages(data: GuideData): number {
  const last = sommaireEntries(data).at(-1)
  if (!last) return COVER_PAGES + cadrePageCount(data) + SOMMAIRE_PAGES
  return last.page + last.pagesFiche - 1
}

export function fichesWithStartPage(data: GuideData): { fiche: Fiche; startPage: number }[] {
  let page = firstFicheGlobalPage(data)
  return fichesTriees(data).map((fiche) => {
    const startPage = page
    page += fichePageCount(fiche)
    return { fiche, startPage }
  })
}

export function hexToTint(hex: string, mix = 0.88): string {
  const raw = hex.replace('#', '')
  if (raw.length !== 6) return '#F8FAFC'
  const r = Number.parseInt(raw.slice(0, 2), 16)
  const g = Number.parseInt(raw.slice(2, 4), 16)
  const b = Number.parseInt(raw.slice(4, 6), 16)
  const mixCh = (c: number) => Math.round(c + (255 - c) * mix)
  return `rgb(${mixCh(r)}, ${mixCh(g)}, ${mixCh(b)})`
}
