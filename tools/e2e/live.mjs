import { chromium } from 'playwright-core'
const b = await chromium.launch({ channel: 'chrome', headless: true })
const p = await b.newPage()
const errs = []
p.on('pageerror', (e) => errs.push(e.message))
const sb = []
p.on('response', (r) => r.url().includes('supabase.co') && sb.push(`${r.status()} ${r.url().split('.co')[1].slice(0, 50)}`))
const U = 'https://rajuvegesana98.github.io/designer-kid'
for (const [path, check] of [['/', 'h1'], ['/start', 'h1'], ['/lesson/b1-what-is-ui', '#lesson-title'], ['/career/interviews', '.qa-item'], ['/admin', 'h1']]) {
  await p.goto(U + path)
  const ok = await p.locator(check).first().waitFor({ timeout: 15000 }).then(() => true).catch(() => false)
  console.log(ok ? '✓' : '✗', path, ok ? '— ' + (await p.locator(check).first().textContent()).slice(0, 50) : '')
}
await p.screenshot({ path: 'live-admin.png' })
console.log('supabase calls:', [...new Set(sb)].slice(0, 6).join(' | '))
console.log('errors:', errs.length ? errs.slice(0, 3) : 'none')
await b.close()
