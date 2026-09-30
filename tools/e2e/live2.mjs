import { chromium } from 'playwright-core'
const b = await chromium.launch({ channel: 'chrome', headless: true })
const p = await b.newPage()
const errs = []
p.on('pageerror', (e) => errs.push(e.message))
const U = 'https://rajuvegesana98.github.io/designer-kid'
for (const [path, check] of [['/', 'h1'], ['/blog', '.blog-card'], ['/blog/portfolio-mistakes-that-hide-good-work', '#post-title'], ['/lesson/b2-frames', '#lesson-title'], ['/reviews', 'h1'], ['/admin', 'h1']]) {
  await p.goto(U + path + '?v=' + Date.now())
  const ok = await p.locator(check).first().waitFor({ timeout: 20000 }).then(() => true).catch(() => false)
  console.log(ok ? '✓' : '✗', path, ok ? '— ' + (await p.locator(check).first().textContent()).slice(0, 60) : '')
}
console.log('errors:', errs.length ? errs.slice(0, 3) : 'none')
await b.close()
