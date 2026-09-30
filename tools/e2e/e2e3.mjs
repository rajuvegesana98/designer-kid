import { chromium } from 'playwright-core'
import { mkdirSync } from 'node:fs'

const BASE = process.env.BASE || 'http://localhost:5181'
const OUT = new URL('./shots3/', import.meta.url).pathname
mkdirSync(OUT, { recursive: true })
const LOGO = new URL('./logo.svg', import.meta.url).pathname
import { writeFileSync } from 'node:fs'
writeFileSync(LOGO, '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#E8590C"/><text x="32" y="42" font-size="28" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="700">HK</text></svg>')

const browser = await chromium.launch({ channel: 'chrome', headless: true })
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
await ctx.addInitScript(() => { window.print = () => {} })
const page = await ctx.newPage()
const errors = []
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message))
page.on('console', (m) => m.type() === 'error' && errors.push('console: ' + m.text()))
const step = async (name, fn) => {
  try { await fn(); console.log('✓', name) } catch (e) { console.log('✗', name, '-', e.message.split('\n')[0]); await page.screenshot({ path: `${OUT}fail-${name.replace(/\W+/g, '_')}.png` }) }
}
const shot = (n) => page.screenshot({ path: `${OUT}${n}.png` })
const publish = async () => {
  await page.getByRole('button', { name: 'Publish', exact: true }).click()
  await page.getByRole('button', { name: 'Publish now' }).click()
  await page.getByText(/Published — students/).waitFor()
}

await step('blog index + post + PDF', async () => {
  await page.goto(BASE + '/start?level=beginner')
  await page.getByRole('button', { name: 'Continue as Beginner' }).click()
  await page.goto(BASE + '/blog')
  await page.locator('.blog-card').first().waitFor()
  const n = await page.locator('.blog-card').count()
  if (n < 5) throw new Error('posts: ' + n)
  await page.waitForTimeout(500)
  await shot('01-blog')
  await page.locator('.blog-card').first().click()
  await page.locator('#post-title').waitFor()
  await page.waitForTimeout(400)
  await shot('02-post')
  await page.getByRole('link', { name: 'PDF' }).click()
  await page.locator('.print-doc h1').waitFor()
})

await step('admin: create + enable popup offer, publish, visitor sees it, dismiss sticks', async () => {
  await page.goto(BASE + '/admin')
  await page.getByRole('button', { name: 'Open admin for this browser' }).click()
  await page.goto(BASE + '/admin/offers')
  await page.getByRole('button', { name: 'New offer' }).click()
  const title = page.getByLabel(/^Title/)
  await title.fill('Launch week: 20% off 1:1 reviews')
  await title.blur()
  await page.getByLabel('Format').selectOption('popup')
  await page.getByRole('switch', { name: /Offer is off/ }).check({ force: true })
  await page.waitForTimeout(500)
  await shot('03-admin-offer')
  await publish()
  await page.goto(BASE + '/learn')
  await page.getByRole('dialog', { name: 'Launch week: 20% off 1:1 reviews' }).waitFor({ timeout: 6000 })
  await shot('04-popup')
  await page.getByRole('button', { name: 'No thanks' }).click()
  await page.reload()
  await page.waitForTimeout(2000)
  if (await page.getByRole('dialog', { name: /Launch week/ }).count()) throw new Error('popup came back after dismiss')
})

await step('admin: banner offer shows as bar', async () => {
  await page.goto(BASE + '/admin/offers')
  await page.getByRole('button', { name: 'New offer' }).click()
  const title = page.getByLabel(/^Title/)
  await title.fill('New: Interview Q&A guides are live')
  await title.blur()
  await page.getByRole('switch', { name: /Offer is off/ }).check({ force: true })
  await page.waitForTimeout(400)
  await publish()
  await page.goto(BASE + '/')
  await page.locator('.promo-bar').getByText('New: Interview Q&A guides are live').waitFor()
  await page.waitForTimeout(300)
  await shot('05-bar')
})

await step('admin: theme preset + logo, publish, site updates', async () => {
  await page.goto(BASE + '/admin/theme')
  await page.getByRole('button', { name: /Ocean/ }).click()
  await page.locator('.field').filter({ hasText: /^Logo/ }).getByRole('button', { name: 'Choose image' }).click()
  await page.locator('.dialog input[type=file]').setInputFiles(LOGO)
  await page.waitForTimeout(800)
  await shot('06-theme')
  await publish()
  await page.goto(BASE + '/learn')
  await page.waitForTimeout(800)
  const primary = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--c-primary').trim())
  if (primary.toLowerCase() !== '#0b63ce') throw new Error('primary is ' + primary)
  const logo = await page.locator('.sidebar .brand-mark img').count()
  if (!logo) throw new Error('logo not shown')
  await shot('07-site-ocean')
})

await step('admin: new blog article via slide editor, publish, visible', async () => {
  await page.goto(BASE + '/admin/blog')
  await page.getByRole('button', { name: 'New article' }).click()
  await page.locator('.slide-canvas h1.inline-editable').click()
  const ed = page.locator('.slide-canvas textarea.inline-editor')
  await ed.fill('Five Figma shortcuts I use every day')
  await ed.blur()
  await page.getByRole('button', { name: 'Mark as published' }).click()
  await page.waitForTimeout(500)
  await shot('08-admin-blog')
  await publish()
  await page.goto(BASE + '/blog')
  await page.getByText('Five Figma shortcuts I use every day').waitFor()
})

console.log('\nErrors:', errors.length ? '\n' + [...new Set(errors)].slice(0, 10).join('\n') : 'none')
await browser.close()
