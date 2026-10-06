import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const gristTarget = env.GRIST_BASE_URL || 'https://grist.numerique.gouv.fr/api'

  return {
    plugins: [react()],
    base: './',
    server: {
      cors: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      proxy: {
        '/grist': {
          target: gristTarget,
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/grist/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              if (env.GRIST_API_KEY) {
                proxyReq.setHeader('Authorization', `Bearer ${env.GRIST_API_KEY}`)
              }
            })
          },
        },
      },
    },
  }
})
