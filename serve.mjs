// A tiny local server for dist/, for trying the site on your computer.
// Render does not use this file: it serves dist/ itself.

import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'

const root = 'dist'
const port = Number(process.env.PORT) || 8080
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.svg': 'image/svg+xml', '.js': 'text/javascript' }

createServer(async (req, res) => {
  let path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^(\.\.[/\\])+/, '')
  if (path.endsWith('/')) path += 'index.html'
  try {
    const body = await readFile(join(root, path))
    res.writeHead(200, { 'Content-Type': types[extname(path)] || 'application/octet-stream' })
    res.end(body)
  } catch {
    const body = await readFile(join(root, '404.html')).catch(() => 'Not found')
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' })
    res.end(body)
  }
}).listen(port, () => console.log(`Open http://localhost:${port}`))
