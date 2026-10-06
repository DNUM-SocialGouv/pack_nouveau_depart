export type Thematique = {
  id: number
  libelle: string
  ordre: number
  couleur: string
}

export type PageCadre = {
  id: number
  titre: string
  corps: string
  ordre: number
}

export type Fiche = {
  id: number
  thematiqueId: number
  titreStructure: string
  sigle: string
  preambule: string
  descriptionOffre: string
  delaisModalites: string
  conditionsAcces: string
  implantation: string
  horaires: string
  apports: string
  pointsVigilance: string
  ordreDansTheme: number
  pagesForcees: 1 | 2
}

export type GuideData = {
  thematiques: Thematique[]
  pagesCadre: PageCadre[]
  fiches: Fiche[]
}

export type SommaireEntry = {
  titre: string
  page: number
  thematique: string
  couleur: string
  pagesFiche: 1 | 2
}
