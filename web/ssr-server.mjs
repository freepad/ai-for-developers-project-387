import { createServer } from 'node:http'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

await import('./dist/server/entry.mjs')

const { renderPage } = await import('vike/server')

const PORT = process.env.SSR_PORT || 3001

const server = createServer(async (req, res) => {
  const url = req.url || '/'

  if (url.startsWith('/api/')) {
    res.writeHead(404)
    res.end('Not found')
    return
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