import React, { useCallback, useEffect, useState } from 'react'
import { PDFDownloadLink, pdf } from '@react-pdf/renderer'
import { loadGuideData, type GuideSource } from './grist/loadGuide.ts'
import type { GuideData } from './guide/types.ts'
import { GuideDocument } from './pdf/GuideDocument.tsx'

export default function App() {
  const [data, setData] = useState<GuideData | null>(null)
  const [source, setSource] = useState<GuideSource | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(() => {
    setLoading(true)
    setError(null)
    loadGuideData()
      .then((loaded) => {
        setData(loaded.data)
        setSource(loaded.source)
      })
      .catch((e: unknown) => {
        setError(e instanceof Error ? e.message : String(e))
        setData(null)
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    if (!data) return
    let cancelled = false
    let objectUrl: string | undefined
    pdf(<GuideDocument data={data} />)
      .toBlob()
      .then((blob) => {
        if (cancelled) return
        objectUrl = URL.createObjectURL(blob)
        setPreviewUrl(objectUrl)
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : String(e))
        }
      })
    return () => {
      cancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [data])

  const ficheCount = data?.fiches.length ?? 0

  return (
    <div className="pnd-app">
      <div className="fr-notice fr-notice--info">
        <div className="fr-container">
          <div className="fr-notice__body">
            <p>
              <span className="fr-notice__title">POC Pack Nouveau Départ</span>
              <span className="fr-notice__desc">
                Données fictives. Guide d’orientation pour travailleurs sociaux, pas un
                annuaire grand public.
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="pnd-main">
        <div className="fr-container fr-py-2w">
          <div className="fr-grid-row fr-grid-row--gutters fr-grid-row--middle">
            <div className="fr-col-12 fr-col-md-7">
              <h1 className="fr-h3 fr-mb-1w">
                Guide opérationnel des ressources mobilisables
              </h1>
              <p className="fr-text--sm fr-mb-0">
                Vendée démo — extrait régénérable depuis Grist
              </p>
            </div>
            <div className="fr-col-12 fr-col-md-5">
              <ul className="fr-btns-group fr-btns-group--inline-reverse fr-btns-group--right fr-btns-group--sm">
                <li>
                  {data ? (
                    <PDFDownloadLink
                      className="fr-btn fr-btn--icon-left fr-icon-file-download-line"
                      document={<GuideDocument data={data} />}
                      fileName="guide-demo.pdf"
                    >
                      {({ loading: pdfLoading }) =>
                        pdfLoading ? 'Préparation du PDF' : 'Télécharger le PDF'
                      }
                    </PDFDownloadLink>
                  ) : null}
                </li>
                <li>
                  <button
                    type="button"
                    className="fr-btn fr-btn--secondary"
                    onClick={load}
                  >
                    Actualiser les données
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {source ? (
            <ul className="fr-badges-group fr-mt-2w">
              <li>
                <p className="fr-badge fr-badge--info fr-badge--no-icon">
                  {source === 'widget'
                    ? 'Source : widget Grist'
                    : 'Source : API Grist (local)'}
                </p>
              </li>
              {data
                ? data.thematiques.map((theme) => (
                    <li key={theme.id}>
                      <p className="fr-badge fr-badge--sm">{theme.libelle}</p>
                    </li>
                  ))
                : null}
              <li>
                <p className="fr-badge fr-badge--success fr-badge--no-icon">
                  {ficheCount} fiche{ficheCount > 1 ? 's' : ''}
                </p>
              </li>
            </ul>
          ) : null}

          {error ? (
            <div className="fr-alert fr-alert--error fr-mt-3w" role="alert">
              <h2 className="fr-alert__title">Impossible de lire les données</h2>
              <p>
                Dans Grist, ajoutez cette page en widget personnalisé (URL de l’app). En
                local, renseignez <code>.env</code> et lancez <code>npm run dev</code>.{' '}
                {error}
              </p>
            </div>
          ) : null}

          {loading ? <p className="fr-mt-3w">Chargement des tables Grist…</p> : null}

          {!loading && data ? (
            <div className="fr-callout fr-mt-2w fr-mb-2w">
              <h2 className="fr-callout__title">Aperçu du PDF</h2>
              <p className="fr-callout__text">
                Les 6 rubriques de chaque fiche viennent des colonnes Grist. Modifiez une
                ligne, cliquez sur Actualiser, puis retéléchargez le PDF. Faites défiler
                dans le cadre ci-dessous pour feuilleter les pages.
              </p>
            </div>
          ) : null}

          {previewUrl ? (
            <iframe
              className="pnd-preview"
              title="Aperçu du guide PDF"
              src={previewUrl}
            />
          ) : data && !error && !loading ? (
            <p className="fr-mt-2w">Composition de l’aperçu PDF…</p>
          ) : null}
        </div>
      </div>
    </div>
  )
}
