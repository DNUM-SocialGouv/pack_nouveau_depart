import React from 'react'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import type { Fiche, GuideData, PageCadre, Thematique } from '../guide/types.ts'
import {
  COVER_PAGES,
  cadrePageCount,
  dash,
  fichePageCount,
  fichesWithStartPage,
  hexToTint,
  sommaireEntries,
  thematiqueOf,
  totalPages,
} from '../guide/layout.ts'

const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 48,
    paddingHorizontal: 40,
    fontFamily: 'Helvetica',
    fontSize: 10.5,
    lineHeight: 1.45,
    color: '#1E293B',
  },
  cover: {
    padding: 48,
    justifyContent: 'space-between',
  },
  kicker: {
    fontSize: 10,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: '#0F766E',
    marginBottom: 16,
  },
  coverTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 26,
    lineHeight: 1.25,
    color: '#0F172A',
    marginBottom: 12,
  },
  coverSub: {
    fontSize: 14,
    color: '#334155',
    marginBottom: 24,
  },
  coverBox: {
    borderLeftWidth: 6,
    borderLeftColor: '#0F766E',
    paddingLeft: 16,
    paddingVertical: 8,
  },
  coverMeta: {
    fontSize: 10,
    color: '#64748B',
  },
  banner: {
    marginHorizontal: -40,
    marginTop: -36,
    marginBottom: 18,
    paddingVertical: 10,
    paddingHorizontal: 40,
  },
  bannerText: {
    color: '#FFFFFF',
    fontFamily: 'Helvetica-Bold',
    fontSize: 11,
    letterSpacing: 0.4,
  },
  h1: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 18,
    marginBottom: 12,
    color: '#0F172A',
  },
  ficheTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 16,
    marginBottom: 8,
    color: '#0F172A',
  },
  sigle: {
    fontSize: 10,
    color: '#475569',
    marginBottom: 10,
  },
  preambule: {
    fontFamily: 'Helvetica-Oblique',
    fontSize: 9.5,
    color: '#334155',
    marginBottom: 12,
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 0.5,
    borderColor: '#CBD5E1',
  },
  body: {
    fontSize: 10.5,
    color: '#1E293B',
    marginBottom: 8,
  },
  rubrique: {
    marginBottom: 10,
  },
  rubriqueLabel: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: '#0F172A',
    marginBottom: 4,
  },
  vigilance: {
    marginTop: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#B45309',
    backgroundColor: '#FFFBEB',
  },
  footer: {
    position: 'absolute',
    bottom: 22,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 8,
    color: '#64748B',
  },
  sommaireRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 10,
    paddingBottom: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E2E8F0',
  },
  sommaireLeft: {
    flexGrow: 1,
    paddingRight: 12,
  },
  sommaireTheme: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 2,
  },
  sommaireTitre: {
    fontSize: 11,
  },
  sommairePage: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 11,
  },
})

function Paragraphs({ text }: { text: string }) {
  const parts = dash(text).split('\n')
  return (
    <View>
      {parts.map((line, i) => (
        <Text key={`${i}-${line.slice(0, 12)}`} style={styles.body}>
          {line.length > 0 ? line : ' '}
        </Text>
      ))}
    </View>
  )
}

function Rubrique({ label, text }: { label: string; text: string }) {
  return (
    <View style={styles.rubrique} wrap={false}>
      <Text style={styles.rubriqueLabel}>{label}</Text>
      <Paragraphs text={text} />
    </View>
  )
}

function Footer({
  globalPage,
  total,
  ficheLabel,
}: {
  globalPage: number
  total: number
  ficheLabel?: string
}) {
  return (
    <View style={styles.footer} fixed>
      <Text>Guide opérationnel — Vendée démo (POC)</Text>
      <Text>
        {ficheLabel ? `${ficheLabel}  ·  ` : ''}
        {globalPage}/{total}
      </Text>
    </View>
  )
}

function Banner({ theme }: { theme: Thematique }) {
  return (
    <View style={[styles.banner, { backgroundColor: theme.couleur }]}>
      <Text style={styles.bannerText}>{theme.libelle}</Text>
    </View>
  )
}

function CadrePage({
  page,
  tint,
  globalPage,
  total,
}: {
  page: PageCadre
  tint: string
  globalPage: number
  total: number
}) {
  return (
    <Page size="A4" style={[styles.page, { backgroundColor: tint }]}>
      <Text style={styles.kicker}>Cadre</Text>
      <Text style={styles.h1}>{page.titre}</Text>
      <Paragraphs text={page.corps} />
      <Footer globalPage={globalPage} total={total} />
    </Page>
  )
}

function fichePages({
  fiche,
  theme,
  startPage,
  total,
}: {
  fiche: Fiche
  theme: Thematique
  startPage: number
  total: number
}) {
  const two = fichePageCount(fiche) === 2
  const tint = hexToTint(theme.couleur)
  const title = fiche.sigle
    ? `${fiche.titreStructure} (${fiche.sigle})`
    : fiche.titreStructure

  const header = (
    <View>
      <Banner theme={theme} />
      <Text style={styles.ficheTitle}>{title}</Text>
      {fiche.preambule.trim() ? (
        <Text style={styles.preambule}>{fiche.preambule}</Text>
      ) : null}
    </View>
  )

  const vigilance = fiche.pointsVigilance.trim() ? (
    <View style={styles.vigilance} wrap={false}>
      <Text style={styles.rubriqueLabel}>Points de vigilance</Text>
      <Paragraphs text={fiche.pointsVigilance} />
    </View>
  ) : null

  const page1 = (
    <Page
      key={`${fiche.id}-1`}
      size="A4"
      style={[styles.page, { backgroundColor: tint }]}
    >
      {header}
      <Rubrique label="Description de l’offre" text={fiche.descriptionOffre} />
      <Rubrique label="Délais et modalités d’intervention" text={fiche.delaisModalites} />
      {two ? null : (
        <View>
          <Rubrique label="Conditions d’accès" text={fiche.conditionsAcces} />
          <Rubrique label="Implantation géographique" text={fiche.implantation} />
          <Rubrique label="Horaires des services mobilisables" text={fiche.horaires} />
          <Rubrique label="Apports pour la personne" text={fiche.apports} />
          {vigilance}
        </View>
      )}
      <Footer
        globalPage={startPage}
        total={total}
        ficheLabel={two ? '1/2' : '1/1'}
      />
    </Page>
  )

  if (!two) return [page1]

  const page2 = (
    <Page
      key={`${fiche.id}-2`}
      size="A4"
      style={[styles.page, { backgroundColor: tint }]}
    >
      <Banner theme={theme} />
      <Text style={styles.ficheTitle}>{title} — suite</Text>
      <Rubrique label="Conditions d’accès" text={fiche.conditionsAcces} />
      <Rubrique label="Implantation géographique" text={fiche.implantation} />
      <Rubrique label="Horaires des services mobilisables" text={fiche.horaires} />
      <Rubrique label="Apports pour la personne" text={fiche.apports} />
      {vigilance}
      <Footer globalPage={startPage + 1} total={total} ficheLabel="2/2" />
    </Page>
  )

  return [page1, page2]
}

export function GuideDocument({ data }: { data: GuideData }) {
  const total = totalPages(data)
  const cadrePages = [...data.pagesCadre].sort((a, b) => a.ordre - b.ordre)
  const entries = sommaireEntries(data)
  const fichesPaged = fichesWithStartPage(data)

  return (
    <Document
      title="Guide opérationnel des ressources mobilisables — Vendée démo"
      author="POC Pack Nouveau Départ"
    >
      <Page size="A4" style={[styles.page, styles.cover, { backgroundColor: '#F1F5F9' }]}>
        <View>
          <Text style={styles.kicker}>Pack Nouveau Départ</Text>
          <Text style={styles.coverTitle}>
            Guide opérationnel des ressources mobilisables
          </Text>
          <Text style={styles.coverSub}>Vendée démo (POC) — extrait</Text>
          <View style={styles.coverBox}>
            <Text style={styles.body}>
              Support d’aide à l’orientation pour les travailleurs sociaux. Données
              fictives ou anonymisées. Ne pas diffuser comme un annuaire grand public.
            </Text>
          </View>
        </View>
        <Text style={styles.coverMeta}>
          Source structurée (Grist) → PDF régénérable. Ce n’est pas un produit national.
        </Text>
        <Footer globalPage={1} total={total} />
      </Page>

      {cadrePages.map((page, i) => (
        <CadrePage
          key={page.id}
          page={page}
          tint={i === 0 ? '#F8FAFC' : '#F0FDFA'}
          globalPage={COVER_PAGES + i + 1}
          total={total}
        />
      ))}

      <Page size="A4" style={[styles.page, { backgroundColor: '#FFFFFF' }]}>
        <Text style={styles.kicker}>Sommaire</Text>
        <Text style={styles.h1}>Fiches structure</Text>
        {entries.map((entry) => (
          <View key={`${entry.page}-${entry.titre}`} style={styles.sommaireRow}>
            <View style={styles.sommaireLeft}>
              <Text style={[styles.sommaireTheme, { color: entry.couleur }]}>
                {entry.thematique}
              </Text>
              <Text style={styles.sommaireTitre}>{entry.titre}</Text>
            </View>
            <Text style={styles.sommairePage}>
              p. {entry.page}
              {entry.pagesFiche === 2 ? `–${entry.page + 1}` : ''}
            </Text>
          </View>
        ))}
        <Footer
          globalPage={COVER_PAGES + cadrePageCount(data) + 1}
          total={total}
        />
      </Page>

      {fichesPaged.flatMap(({ fiche, startPage }) =>
        fichePages({
          fiche,
          theme: thematiqueOf(fiche, data.thematiques),
          startPage,
          total,
        }),
      )}
    </Document>
  )
}
