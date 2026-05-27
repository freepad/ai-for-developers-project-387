import { createServer } from 'node:http'
import { createReadStream, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

await import('./web-dist/server/entry.mjs')

const { renderPage } = await import('vike/server')
const distClientDir = join(__dirname, 'web-dist/client')

const PORT = process.env.SSR_PORT || 3001

const server = createServer(async (req, res) => {
  const url = req.url || '/'

  if (url.startsWith('/api/')) {
    res.writeHead(404)
    res.end('Not found')
    return
  }

  if (url.startsWith('/assets/') || url.includes('.')) {
    const filePath = join(distClientDir, url)
    if (existsSync(filePath)) {
      const ext = url.split('.').pop()
      const contentTypes = {
        js: 'application/javascript',
        css: 'text/css',
        html: 'text/html',
        json: 'application/json',
        png: 'image/png',
        svg: 'image/svg+xml',
        ico: 'image/x-icon'
      }
      res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'text/plain' })
      createReadStream(filePath).pipe(res)
      return
    }
  }

  try {
    const pageContext = await renderPage({ urlOriginal: url })
    const { body, statusCode, contentType } = pageContext

    res.writeHead(statusCode, { 'Content-Type': contentType || 'text/html' })

    if (body && typeof body.pipe === 'function') {
      body.pipe(res)
    } else {
      res.end(body)
    }
  } catch (err) {
    console.error('SSR error:', err)
    res.writeHead(500)
    res.end('Internal Server Error')
  }
})

server.listen(PORT, '0.0.0.0', () => {
  console.log(`SSR server running on port ${PORT}`)
})