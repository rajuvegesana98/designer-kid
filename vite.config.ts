import react from '@vitejs/plugin-react'
import { motionStudio } from 'motion-studio'
import { defineConfig } from 'vite'

// BASE_PATH is set by the GitHub Pages workflow (e.g. "/designer-kid/").
// Motion Studio only instruments the dev server; `vite build` output is checked
// in scripts/postbuild.mjs so the panel can never ship to production.
// Set MOTION_STUDIO=off to run the dev server without it (e.g. for automated tests).
export default defineConfig(({ command }) => ({
  base: process.env.BASE_PATH ?? '/',
  plugins: [...(command === 'serve' && process.env.MOTION_STUDIO !== 'off' ? [motionStudio({ excludePaths: [/^\/admin/] })] : []), react()],
}))
