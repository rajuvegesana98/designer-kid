// Runs after `vite build`:
// 1. Fails the build if any Motion Studio panel/instrumentation leaked into production.
// 2. Adds SEO/social tags (canonical, Open Graph, Twitter) when SITE_URL is known.
// 3. Writes robots.txt and sitemap.xml for the known public routes.
// 4. Writes a copy of index.html for every known route (so GitHub Pages answers 200, not 404)
//    and keeps 404.html as the fallback for routes added later in the admin.
import { copyFileSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const dist = join(root, 'dist')

// ── 1. No Motion Studio in production ────────────────────────────────────
const files = []
const walk = (dir) => {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f)
    statSync(p).isDirectory() ? walk(p) : files.push(p)
  }
}
walk(dist)
const leaked = files.filter((f) => /\.(js|html|css)$/.test(f) && /motion-studio|motionStudio|__MOTION_STUDIO/i.test(readFileSync(f, 'utf8')))
if (leaked.length) {
  console.error('✗ Motion Studio code found in production build:\n  ' + leaked.join('\n  '))
  process.exit(1)
}
console.log(`✓ No Motion Studio code in production build (${files.length} files checked)`)

// ── 2. SEO / social tags ─────────────────────────────────────────────────
// SITE_URL is the public site root, e.g. https://user.github.io/designer-kid (set by the deploy workflow).
const siteUrl = (process.env.SITE_URL || '').replace(/\/$/, '')
const indexPath = join(dist, 'index.html')
let html = readFileSync(indexPath, 'utf8')
const title = 'Designer Kid — Learn. Design. Build. Grow.'
const description = 'Learn UI/UX design, build real projects and prepare for your design career. Free lessons for beginner, intermediate and expert designers.'
if (siteUrl) {
  const tags = [
    `<link rel="canonical" href="${siteUrl}/" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Designer Kid" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:url" content="${siteUrl}/" />`,
    `<meta property="og:image" content="${siteUrl}/og-image.png" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
    `<meta name="twitter:image" content="${siteUrl}/og-image.png" />`,
  ].join('\n    ')
  html = html.replace('</head>', `    ${tags}\n  </head>`)
  writeFileSync(indexPath, html)
  console.log('✓ Added canonical, Open Graph and Twitter tags for ' + siteUrl)
} else {
  console.log('• SITE_URL not set — skipped canonical/Open Graph tags, robots.txt and sitemap.xml')
}

// ── 3 + 4. Known public routes (read from the bundled seed content) ─────
const seedDir = join(root, 'src/content/seed')
const seed = readdirSync(seedDir).map((f) => readFileSync(join(seedDir, f), 'utf8')).join('\n')
const uniq = (arr) => [...new Set(arr)]
const lessons = uniq([...seed.matchAll(/\bid: '([bie]\d-[a-z0-9-]+)'/g)].map((m) => m[1]))
const modules = [...new Map([...seed.matchAll(/\bid: '(([bie])-m\d+-[a-z0-9-]+)'/g)].map((m) => [m[1], [m[2], m[1]]])).values()]
const levelOf = { b: 'beginner', i: 'intermediate', e: 'expert' }
const challenges = uniq([...seed.matchAll(/\bid: '(ch-[a-z0-9-]+)'/g)].map((m) => m[1]))
const posts = uniq([...seed.matchAll(/\bslug: '([a-z0-9-]+)'/g)].map((m) => m[1]))
const careerSections = ['resume', 'linkedin', 'portfolio', 'job-search', 'interviews', 'networking']

const routes = uniq([
  '/', '/welcome', '/start', '/learn', '/learn/beginner', '/learn/intermediate', '/learn/expert',
  '/challenges', '/career', '/resources', '/blog', '/reviews', '/progress', '/profile', '/search',
  ...modules.map(([l, id]) => `/learn/${levelOf[l]}/${id}`),
  ...lessons.map((id) => `/lesson/${id}`),
  ...challenges.map((id) => `/challenges/${id}`),
  ...careerSections.map((s) => `/career/${s}`),
  ...posts.map((s) => `/blog/${s}`),
])

// Route copies of index.html so deep links return HTTP 200 on static hosting.
let written = 0
for (const r of routes) {
  if (r === '/') continue
  const dir = join(dist, r)
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.html'), html)
  written++
}
console.log(`✓ Wrote ${written} route pages (deep links answer 200)`)

// Pages that shouldn't be indexed: personal or utility pages.
const noIndex = new Set(['/progress', '/profile', '/search', '/start'])
if (siteUrl) {
  writeFileSync(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: ${new URL(siteUrl).pathname.replace(/\/$/, '')}/admin\n\nSitemap: ${siteUrl}/sitemap.xml\n`)
  const today = new Date().toISOString().slice(0, 10)
  const urls = routes
    .filter((r) => !noIndex.has(r))
    .map((r) => `  <url><loc>${siteUrl}${r === '/' ? '/' : r + '/'}</loc><lastmod>${today}</lastmod></url>`)
    .join('\n')
  writeFileSync(join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`)
  console.log(`✓ Wrote robots.txt and sitemap.xml (${routes.length - noIndex.size} URLs)`)
}

// SPA fallback for anything not listed (e.g. lessons added later in the admin).
copyFileSync(indexPath, join(dist, '404.html'))
console.log('✓ Copied index.html → 404.html for other deep links')
