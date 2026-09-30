import { chromium } from 'playwright-core'
import { mkdirSync, writeFileSync } from 'node:fs'

const BASE = process.env.BASE || 'http://localhost:5181'
const OUT = new URL('./shots2/', import.meta.url).pathname
mkdirSync(OUT, { recursive: true })
const PDF = new URL('./sample.pdf', import.meta.url).pathname
writeFileSync(PDF, '%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 200 200]/Parent 2 0 R>>endobj\ntrailer<</Root 1 0 R>>\n%%EOF')

const browser = await chromium.launch({ channel: 'chrome', headless: true })
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
await ctx.addInitScript(() => { window.print = () => { window.__printed = (window.__printed || 0) + 1 } })
const page = await ctx.newPage()
const errors = []
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message))
page.on('console', (m) => m.type() === 'error' && errors.push('console: ' + m.text()))
const step = async (name, fn) => {
  try { await fn(); console.log('✓', name) } catch (e) { console.log('✗', name, '-', e.message.split('\n')[0]); await page.screenshot({ path: `${OUT}fail-${name.replace(/\W+/g, '_')}.png` }) }
}
const shot = (n, full = false) => page.screenshot({ path: `${OUT}${n}.png`, fullPage: full })

await step('onboard', async () => {
  await page.goto(BASE + '/start?level=beginner')
  await page.getByRole('button', { name: 'Continue as Beginner' }).click()
  await page.getByRole('heading', { name: /Welcome/ }).waitFor()
})

await step('any lesson opens (no locks), cover illustration shown', async () => {
  await page.goto(BASE + '/learn/beginner')
  if (await page.getByText('Locked', { exact: true }).count()) throw new Error('lock badge still shown')
  await page.goto(BASE + '/lesson/b2-auto-layout').catch(() => {})
  const title = await page.locator('#lesson-title').textContent({ timeout: 8000 }).catch(() => null)
  if (!title) {
    // id may differ — open the 7th Figma lesson via the module page
    await page.goto(BASE + '/learn/beginner/b-m2-figma')
    await page.locator('ol li a').nth(6).click()
    await page.locator('#lesson-title').waitFor()
  }
  await page.locator('.lesson-cover svg').first().waitFor()
  await page.waitForTimeout(500)
  await shot('01-lesson-cover')
})

await step('lesson PDF view', async () => {
  await page.getByRole('link', { name: 'Download PDF' }).click()
  await page.locator('.print-doc h1').waitFor()
  await page.waitForTimeout(1500)
  const printed = await page.evaluate(() => window.__printed || 0)
  if (!printed) throw new Error('print dialog not triggered')
  await page.emulateMedia({ media: 'print' })
  await shot('02-print-lesson', true)
  await page.emulateMedia({ media: 'screen' })
  const pdf = await page.pdf({ format: 'A4', printBackground: true }).catch(() => null)
  if (pdf) writeFileSync(`${OUT}lesson.pdf`, pdf)
})

await step('module PDF', async () => {
  await page.goto(BASE + '/print/module/beginner/b-m1-fundamentals?auto=0')
  await page.getByRole('heading', { name: 'UI/UX Fundamentals', level: 1 }).waitFor()
  const n = await page.locator('.print-lesson').count()
  if (n < 10) throw new Error('expected all lessons, got ' + n)
})

await step('interview Q&A guide', async () => {
  await page.goto(BASE + '/career/interviews')
  await page.locator('.qa-item').first().waitFor()
  const q = await page.locator('.qa-item').count()
  if (q < 10) throw new Error('few Q&A: ' + q)
  await page.locator('.qa-item summary').first().click()
  await page.waitForTimeout(300)
  await shot('03-interview-qa')
})

await step('linkedin do/dont + resume guides', async () => {
  await page.goto(BASE + '/career/linkedin')
  await page.locator('.dodont').first().waitFor()
  await page.goto(BASE + '/career/resume')
  await page.getByRole('heading', { name: /Resume/ }).first().waitFor()
  const guides = await page.locator('article[id^="cg-"]').count()
  if (guides < 2) throw new Error('expected resume guides, got ' + guides)
  await shot('04-resume', false)
})

await step('write a review', async () => {
  await page.goto(BASE + '/reviews')
  await page.getByRole('radio', { name: '5 stars' }).click()
  await page.getByLabel('Role (optional)').fill('Junior Product Designer')
  await page.getByLabel('Name shown with the review').fill('Asha')
  await page.getByLabel('Your review').fill('Harikrishna reviewed my portfolio and helped me rewrite my first case study so it told a clear story.')
  await page.getByRole('checkbox').check()
  await page.getByRole('button', { name: 'Submit review' }).click()
  await page.getByText('It will appear here once it has been approved.').waitFor()
})

await step('admin approves review; shows on reviews page & homepage', async () => {
  await page.goto(BASE + '/admin')
  await page.getByRole('button', { name: 'Open admin for this browser' }).click()
  await page.getByText(/review waiting for approval/).waitFor()
  await page.goto(BASE + '/admin/reviews')
  await page.getByRole('button', { name: 'Approve' }).click()
  await page.getByRole('tab', { name: /Approved/ }).click()
  await page.getByRole('button', { name: 'Feature' }).click()
  await page.waitForTimeout(300)
  await shot('05-admin-reviews')
  await page.goto(BASE + '/reviews')
  await page.getByText(/rewrite my first case study/).waitFor()
  await page.goto(BASE + '/welcome')
  await page.locator('#reviews-home-title').waitFor()
})

await step('slide editor: inline edit, insert, undo, upload PDF', async () => {
  await page.goto(BASE + '/admin/courses?level=beginner&course=b-foundations&module=b-m1-fundamentals&lesson=b1-what-is-ui')
  await page.locator('.slide-editor').waitFor()
  await page.waitForTimeout(500)
  await shot('06-slide-editor-cover')
  // select first learn slide, edit inline
  await page.locator('.slide-rail .slide-item').nth(1).click()
  await page.locator('.slide-canvas .inline-editable').first().click()
  const ed = page.locator('.slide-canvas textarea.inline-editor')
  await ed.fill('Edited inline like PowerPoint.')
  await ed.blur()
  await page.locator('.slide-canvas').getByText('Edited inline like PowerPoint.').waitFor()
  // insert Q&A slide
  const before = await page.locator('.slide-rail .slide-item').count()
  await page.getByRole('button', { name: 'Q&A', exact: true }).click()
  const after = await page.locator('.slide-rail .slide-item').count()
  if (after !== before + 1) throw new Error('insert failed')
  await page.waitForTimeout(300)
  await shot('07-slide-editor-qa')
  // undo insert
  await page.getByRole('button', { name: 'Undo', exact: true }).click()
  await page.waitForTimeout(300)
  const undone = await page.locator('.slide-rail .slide-item').count()
  if (undone !== before) throw new Error('undo failed: ' + undone + ' vs ' + before)
  // upload attachment on Downloads slide
  await page.locator('.slide-rail .slide-item').last().click()
  await page.locator('.slide-panel input[type=file]').setInputFiles(PDF)
  await page.locator('.slide-canvas .file-card').waitFor()
  await page.waitForTimeout(1500)
  // preview shows the edit and the download
  const [preview] = await Promise.all([ctx.waitForEvent('page'), page.getByRole('button', { name: 'Preview lesson' }).click()])
  await preview.getByText('Edited inline like PowerPoint.').waitFor({ timeout: 8000 })
  await preview.getByText('Downloads for this lesson').waitFor()
  await preview.close()
})

await step('mobile lesson + slide editor', async () => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(BASE + '/career/interviews')
  await page.waitForTimeout(500)
  await shot('08-mobile-interviews')
  await page.goto(BASE + '/admin/courses?level=beginner&course=b-foundations&module=b-m1-fundamentals&lesson=b1-what-is-ui')
  await page.waitForTimeout(800)
  await shot('09-mobile-slide-editor')
})

console.log('\nErrors:', errors.length ? '\n' + [...new Set(errors)].slice(0, 15).join('\n') : 'none')
await browser.close()
