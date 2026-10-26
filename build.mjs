// Copies src/ to dist/ and puts the Privatus Analytics script in every page.
//
// Settings come from environment variables, so nothing secret or site
// specific lives in the code:
//
//   PRIVATUS_SITE_ID   your site id, like pa_7Q2K9XH3AB (required to count visits)
//   PRIVATUS_MODULES   optional, tracker modules split by commas
//                      (default: engage,auto,vitals,clicks,ask)
//
// Without a valid site id the site still builds, with no script in it.

import { cpSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

export const MARKER = '<!-- privatus-analytics -->'
export const DEFAULT_MODULES = 'engage,auto,vitals,clicks,ask'
const SCRIPT_SRC = 'https://privatusstats.com/js/pa.js'
const SITE_ID = /^pa_[A-Za-z0-9]{1,64}$/
const MODULE = /^[a-z]{1,20}$/

export function buildTag(env = {}) {
  const site = String(env.PRIVATUS_SITE_ID || '').trim()
  if (!SITE_ID.test(site)) return ''
  const raw = env.PRIVATUS_MODULES === undefined ? DEFAULT_MODULES : env.PRIVATUS_MODULES
  const modules = String(raw)
    .split(',')
    .map((m) => m.trim().toLowerCase())
    .filter((m) => MODULE.test(m))
    .join(',')
  return `<script defer src="${SCRIPT_SRC}" data-site="${site}" data-modules="${modules}"></script>`
}

function htmlFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return htmlFiles(path)
    return name.endsWith('.html') ? [path] : []
  })
}

export function build({ src = 'src', out = 'dist', env = process.env, log = console } = {}) {
  rmSync(out, { recursive: true, force: true })
  cpSync(src, out, { recursive: true })

  const tag = buildTag(env)
  const pages = htmlFiles(out)
  for (const page of pages) {
    const html = readFileSync(page, 'utf8')
    writeFileSync(page, html.split(MARKER).join(tag))
  }

  if (tag) {
    log.log(`Privatus Analytics: added to ${pages.length} page(s) for ${env.PRIVATUS_SITE_ID.trim()}.`)
  } else if (env.PRIVATUS_SITE_ID) {
    log.warn('Privatus Analytics: PRIVATUS_SITE_ID does not look like pa_ followed by letters and digits, so no script was added.')
  } else {
    log.warn('Privatus Analytics: PRIVATUS_SITE_ID is not set, so no script was added.')
  }
  return { tag, pages }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  build()
}
