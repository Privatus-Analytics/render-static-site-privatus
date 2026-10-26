import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, mkdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { build, buildTag, MARKER } from '../build.mjs'

const quiet = { log() {}, warn() {} }

test('builds the tag from the site id with the default modules', () => {
  assert.equal(
    buildTag({ PRIVATUS_SITE_ID: ' pa_7Q2K9XH3AB ' }),
    '<script defer src="https://privatusstats.com/js/pa.js" data-site="pa_7Q2K9XH3AB" data-modules="engage,auto,vitals,clicks,ask"></script>',
  )
})

test('prints nothing without a valid site id', () => {
  assert.equal(buildTag({}), '')
  assert.equal(buildTag({ PRIVATUS_SITE_ID: 'pa_"><script>' }), '')
  assert.equal(buildTag({ PRIVATUS_SITE_ID: 'UA-12345' }), '')
})

test('keeps only well-formed module names', () => {
  const tag = buildTag({ PRIVATUS_SITE_ID: 'pa_X1', PRIVATUS_MODULES: 'engage, Vitals,"bad",' })
  assert.match(tag, /data-modules="engage,vitals"/)
  assert.match(buildTag({ PRIVATUS_SITE_ID: 'pa_X1', PRIVATUS_MODULES: '' }), /data-modules=""/)
})

test('puts the tag in every page, nested ones too, and leaves other files alone', () => {
  const dir = mkdtempSync(join(tmpdir(), 'pa-render-'))
  const src = join(dir, 'src')
  mkdirSync(join(src, 'blog'), { recursive: true })
  writeFileSync(join(src, 'index.html'), `<head>${MARKER}</head>`)
  writeFileSync(join(src, 'blog', 'post.html'), `<head>${MARKER}</head>`)
  writeFileSync(join(src, 'style.css'), MARKER)

  const out = join(dir, 'dist')
  const { pages } = build({ src, out, env: { PRIVATUS_SITE_ID: 'pa_X1' }, log: quiet })

  assert.equal(pages.length, 2)
  assert.match(readFileSync(join(out, 'index.html'), 'utf8'), /data-site="pa_X1"/)
  assert.match(readFileSync(join(out, 'blog', 'post.html'), 'utf8'), /data-site="pa_X1"/)
  assert.equal(readFileSync(join(out, 'style.css'), 'utf8'), MARKER)
})

test('still builds, without the script, when the site id is missing', () => {
  const dir = mkdtempSync(join(tmpdir(), 'pa-render-'))
  const src = join(dir, 'src')
  mkdirSync(src)
  writeFileSync(join(src, 'index.html'), `<head>${MARKER}</head>`)
  const out = join(dir, 'dist')
  build({ src, out, env: {}, log: quiet })
  assert.equal(readFileSync(join(out, 'index.html'), 'utf8'), '<head></head>')
})
