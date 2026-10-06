import 'dotenv/config'
import { renderToFile } from '@react-pdf/renderer'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { createElement } from 'react'
import { fetchGuideData } from './grist/client.ts'
import { GuideDocument } from './pdf/GuideDocument.tsx'

function requiredEnv(name: string): string {
  const v = process.env[name]
  if (!v) {
    throw new Error(
      `Variable manquante : ${name}. Copiez .env.example vers .env et renseignez la clé API Grist.`,
    )
  }
  return v
}

async function main() {
  const data = await fetchGuideData({
    baseUrl: process.env.GRIST_BASE_URL ?? 'https://grist.numerique.gouv.fr/api',
    docId: process.env.GRIST_DOC_ID ?? 'vygR8LGAq3an',
    apiKey: requiredEnv('GRIST_API_KEY'),
  })

  const instance = createElement(GuideDocument, { data })
  const out = path.resolve('dist/guide-demo.pdf')
  await mkdir(path.dirname(out), { recursive: true })
  await renderToFile(instance, out)
  console.log(`PDF A4 écrit : ${out}`)
}

main().catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : err)
  process.exit(1)
})
