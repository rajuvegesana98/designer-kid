import { chromium } from 'playwright-core'
import { mkdirSync } from 'node:fs'
const BASE = process.env.BASE || 'http://localhost:5181'
const OUT = new URL('./shots4/', import.meta.url).pathname
mkdirSync(OUT, { recursive: true })
const b = await chromium.launch({ channel: 'chrome', headless: true })
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } })
const page = await ctx.newPage()
const errors = []
page.on('pageerror', (e) => errors.push(e.message))
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
const step = async (n, fn) => { try { await fn(); console.log('✓', n) } catch (e) { console.log('✗', n, '-', e.message.split('\n')[0]); await page.screenshot({ path: `${OUT}fail-${n.replace(/\W+/g, '_')}.png` }) } }
await step('landing: 1:1 section + blog strip + nav links', async () => {
  await page.goto(BASE + '/')
  await page.locator('#mentor').waitFor()
  await page.locator('#mentor').getByText('Booking opens soon').waitFor()
  await page.getByRole('heading', { name: 'Latest from the blog' }).waitFor()
  const n = await page.locator('.blog-card').count(); if (n !== 3) throw new Error('blog cards ' + n)
  await page.locator('#mentor').scrollIntoViewIfNeeded(); await page.waitForTimeout(700)
  await page.screenshot({ path: `${OUT}01-landing-mentor.png` })
})
await step('blog has 12 posts', async () => {
  await page.goto(BASE + '/blog'); await page.locator('.blog-card').first().waitFor()
  const n = await page.locator('.blog-card').count(); if (n < 12) throw new Error('posts ' + n)
})
await step('dashboard: blog + mentor', async () => {
  await page.goto(BASE + '/start?level=intermediate')
  await page.getByRole('button', { name: 'Continue as Intermediate' }).click()
  await page.getByRole('heading', { name: 'From the blog' }).waitFor()
  await page.locator('#dashboard-mentor').waitFor()
  await page.getByRole('heading', { name: 'From the blog' }).scrollIntoViewIfNeeded(); await page.waitForTimeout(600)
  await page.screenshot({ path: `${OUT}02-dashboard-blog.png` })
})
await step('reset-password page shows expired state without link', async () => {
  await page.goto(BASE + '/reset-password')
  await page.getByText('This reset link has expired').waitFor({ timeout: 6000 })
})
await step('admin users: manage panel', async () => {
  await page.goto(BASE + '/admin'); await page.getByRole('button', { name: 'Open admin for this browser' }).click()
  await page.goto(BASE + '/admin/users')
  await page.locator('table tbody tr button').first().click()
  await page.getByText('Manage').waitFor()
  await page.locator('#learner-level').selectOption('expert')
  await page.getByText('Level updated').waitFor()
  await page.getByRole('button', { name: 'Reset progress' }).click()
  await page.getByRole('button', { name: 'Reset progress' }).last().click()
  await page.getByText('Progress reset').waitFor()
  await page.screenshot({ path: `${OUT}03-admin-user.png` })
})
console.log('errors:', errors.length ? [...new Set(errors)].slice(0, 5) : 'none')
await b.close()
