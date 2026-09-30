// Runs after `vite build`:
// 1. Fails the build if any Motion Studio panel/instrumentation leaked into production.
// 2. Copies index.html to 404.html so GitHub Pages serves the app for deep links.
import { copyFileSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const dist = new URL('../dist/', import.meta.url).pathname
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

copyFileSync(join(dist, 'index.html'), join(dist, '404.html'))
console.log('✓ Copied index.html → 404.html for GitHub Pages deep links')
