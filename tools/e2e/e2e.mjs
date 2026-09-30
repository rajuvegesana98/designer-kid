import { chromium } from 'playwright-core'

const BASE = process.env.BASE || 'http://localhost:5181'
const OUT = new URL('./shots/', import.meta.url).pathname
import { mkdirSync } from 'node:fs'
mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch({ channel: 'chrome', headless: true })
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await ctx.newPage()
const errors = []
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message))
page.on('console', (m) => m.type() === 'error' && errors.push('console: ' + m.text()))
const step = async (name, fn) => {
  try {
    await fn()
    console.log('✓', name)
  } catch (e) {
    console.log('✗', name, '-', e.message.split('\n')[0])
    await page.screenshot({ path: `${OUT}fail-${name.replace(/\W+/g, '_')}.png` })
  }
}
const shot = (n, full = false) => page.screenshot({ path: `${OUT}${n}.png`, fullPage: full })

await step('landing loads', async () => {
  await page.goto(BASE)
  await page.getByRole('heading', { level: 1 }).waitFor()
  await page.waitForTimeout(800)
  await shot('01-landing')
  await shot('01-landing-full', true)
})

await step('onboarding: choose beginner', async () => {
  await page.getByRole('link', { name: 'Start learning' }).click()
  await page.getByRole('heading', { name: 'Where are you in your design journey?' }).waitFor()
  await page.getByRole('radio', { name: /starting my UI\/UX journey/ }).click()
  await page.getByLabel(/What should we call you/).fill('Asha')
  await page.waitForTimeout(500)
  await shot('02-onboarding')
  await page.getByRole('button', { name: 'Continue as Beginner' }).click()
  await page.getByRole('heading', { name: /Welcome, Asha/ }).waitFor()
  await page.waitForTimeout(900)
  await shot('03-dashboard')
  await shot('03-dashboard-full', true)
})

await step('start first lesson and complete it', async () => {
  await page.getByRole('link', { name: /Start first lesson/ }).click()
  await page.locator('#lesson-title').waitFor()
  await page.waitForTimeout(600)
  await shot('04-lesson')
  await shot('04-lesson-full', true)
  await page.locator('textarea:visible').filter({ has: page.locator('xpath=.') }).first().fill('Remember to use an 8px spacing system.')
  await page.getByRole('button', { name: 'Bookmark', exact: true }).click()
  await page.getByRole('button', { name: /Mark as complete/ }).click()
  await page.getByText('Lesson complete', { exact: true }).waitFor()
  await page.getByRole('link', { name: /Next lesson/ }).click()
  await page.locator('#lesson-title').waitFor()
})

await step('roadmap: everything open', async () => {
  await page.goto(BASE + '/learn')
  await page.getByRole('heading', { name: 'Beginner roadmap' }).waitFor()
  const locked = await page.getByText('Locked', { exact: true }).count()
  if (locked > 0) throw new Error('found locked modules')
  await page.waitForTimeout(600)
  await shot('05-roadmap')
})

await step('later module opens directly', async () => {
  await page.goto(BASE + '/learn/beginner/b-m7-career')
  await page.getByRole('link', { name: /Start module/ }).click()
  await page.locator('#lesson-title').waitFor()
})

await step('search palette', async () => {
  await page.goto(BASE + '/progress')
  await page.getByRole('button', { name: /^Search/ }).click()
  await page.getByRole('combobox', { name: 'Search' }).fill('auto layout')
  await page.getByRole('option').first().waitFor()
  await page.waitForTimeout(300)
  await shot('06-search')
  await page.keyboard.press('Enter')
  await page.waitForTimeout(600)
  if (await page.getByRole('dialog', { name: 'Search Designer Kid' }).count()) throw new Error('palette reopened after Enter')
  await page.locator('#lesson-title, .empty h3').first().waitFor()
})

await step('notes and bookmarks appear in progress', async () => {
  await page.goto(BASE + '/progress?tab=notes')
  await page.getByText('Remember to use an 8px spacing system.').waitFor()
  await page.goto(BASE + '/progress?tab=bookmarks')
  await page.getByRole('heading', { name: /Lessons/ }).waitFor()
})

await step('challenge submission', async () => {
  await page.goto(BASE + '/challenges')
  await page.getByRole('link').filter({ hasText: /UI$/ }).first().waitFor({ timeout: 3000 }).catch(() => {})
  await shot('07-challenges')
  await page.goto(BASE + '/challenges/ch-b-ui')
  await page.getByLabel('Link to your work').fill('https://www.figma.com/file/abc')
  await page.getByLabel('Notes and decisions').fill('Used an 8pt grid.')
  await page.getByRole('button', { name: 'Submit challenge' }).click()
  await page.getByRole('button', { name: 'Submit anyway' }).click()
  await page.getByRole('heading', { name: 'Submitted' }).waitFor()
})

await step('career resume tools + checklist', async () => {
  await page.goto(BASE + '/career/resume')
  await page.getByText('Honest bullet builder').waitFor()
  await page.getByLabel('What you worked on').fill('the checkout flow for a student food app')
  await page.getByText('Clear role').first().click()
  await page.waitForTimeout(300)
  await shot('08-career-resume')
})

await step('dark mode + mobile dashboard', async () => {
  await page.goto(BASE + '/')
  await page.getByRole('button', { name: /Switch to dark mode/ }).click()
  await page.waitForTimeout(500)
  await shot('09-dashboard-dark')
  await page.setViewportSize({ width: 390, height: 844 })
  await page.waitForTimeout(500)
  await shot('10-mobile-dashboard-dark')
  await page.goto(BASE + '/lesson/b1-what-is-ux')
  await page.waitForTimeout(600)
  await shot('11-mobile-lesson')
  await page.getByRole('button', { name: /Switch to light mode/ }).click()
  await page.setViewportSize({ width: 820, height: 1100 })
  await page.goto(BASE + '/')
  await page.waitForTimeout(500)
  await shot('12-tablet-dashboard')
  await page.setViewportSize({ width: 1440, height: 900 })
})

await step('admin: open, edit hero, preview, publish', async () => {
  await page.goto(BASE + '/admin')
  await page.getByRole('button', { name: 'Open admin for this browser' }).click()
  await page.getByRole('heading', { name: 'Dashboard' }).waitFor()
  await page.waitForTimeout(700)
  await shot('13-admin-dashboard')
  await page.goto(BASE + '/admin/website')
  const hero = page.getByLabel(/Hero title/)
  await hero.fill('Design your future, one frame at a time.')
  await hero.blur()
  await page.waitForTimeout(1600)
  await page.getByRole('button', { name: 'Publish', exact: true }).click()
  await page.getByRole('button', { name: 'Publish now' }).click()
  await page.getByText(/Published/).first().waitFor()
  await page.goto(BASE + '/welcome')
  await page.getByRole('heading', { name: 'Design your future, one frame at a time.' }).waitFor()
})

await step('admin: courses editor + lesson edit + preview', async () => {
  await page.goto(BASE + '/admin/courses?level=beginner&course=b-foundations&module=b-m1-fundamentals&lesson=b1-what-is-ui')
  await page.locator('.slide-editor').waitFor()
  await page.waitForTimeout(500)
  await shot('14-admin-lesson-editor')
  await page.getByRole('tab', { name: 'Details' }).click()
  const t = page.getByLabel(/^Title/)
  await t.fill('What is UI? (edited)')
  await t.blur()
  await page.waitForTimeout(600)
  const [preview] = await Promise.all([ctx.waitForEvent('page'), page.getByRole('button', { name: 'Preview lesson' }).click()])
  await preview.getByRole('heading', { name: 'What is UI? (edited)' }).waitFor({ timeout: 8000 })
  await preview.getByText('You are seeing unpublished draft').waitFor()
  await preview.close()
})

await step('admin: theme live preview', async () => {
  await page.goto(BASE + '/admin/theme')
  await page.waitForTimeout(600)
  await shot('15-admin-theme')
})

await step('admin: analytics + users + mobile admin', async () => {
  await page.goto(BASE + '/admin/analytics')
  await page.waitForTimeout(600)
  await shot('16-admin-analytics')
  await page.goto(BASE + '/admin/users')
  await page.waitForTimeout(500)
  await shot('17-admin-users')
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(BASE + '/admin/courses')
  await page.waitForTimeout(500)
  await shot('18-admin-mobile')
})

console.log('\nErrors:', errors.length ? '\n' + [...new Set(errors)].join('\n') : 'none')
await browser.close()
