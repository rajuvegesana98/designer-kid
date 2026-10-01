import { motion } from 'motion/react'
import { ArrowRight, ChevronDown } from 'lucide-react'
import type { CSSProperties } from 'react'
import { Link } from 'react-router'
import { Brand } from '../components/Brand'
import { HeroVisual, LevelIllustration } from '../components/Illustrations'
import { MentorSection, useMentor } from '../components/MentorLink'
import { LatestPosts } from './Blog'
import { Reveal } from '../components/ui'
import { levelLessons, levelModules } from '../lib/content'
import { Icon } from '../lib/icons'
import { useContent } from '../state/content'
import { SiteFooter } from '../components/AppShell'
import { ReviewsSection } from './Reviews'
import { UXMarquee, TopRuler, BottomRuler } from '../components/LandingChrome'

export function Landing() {
  const { content, isPreview } = useContent()
  const mentor = useMentor()
  const h = content.home

  return (
    <div className="canvas-bg landing-chrome" style={{ minHeight: '100dvh' }}>
      <TopRuler />
      <div className="landing-chrome__body">
        <UXMarquee />
        <div className="landing-chrome__content">
      <a href="#main" className="skip-link">Skip to content</a>
      {isPreview && <div className="banner banner-preview" role="status"><strong>Preview</strong> Unpublished draft — this is how the homepage will look.</div>}
      <header className="page row-between" style={{ paddingTop: 20, paddingBottom: 0 }}>
        <Brand />
        <nav className="row" aria-label="Site">
          <a href="#paths" className="btn btn-ghost hide-sm">Learning paths</a>
          <Link to="/blog" className="btn btn-ghost hide-sm">Blog</Link>
          {mentor.enabled && <a href="#mentor" className="btn btn-ghost hide-sm">1:1 Connect</a>}
          <Link to="/start" className="btn btn-primary">Start learning</Link>
        </nav>
      </header>

      <main id="main">
        <section className="page" style={{ paddingTop: 'var(--space-7)' }}>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))', alignItems: 'center', gap: 'var(--space-7)' }}>
            <motion.div className="stack" style={{ '--gap': '22px' } as CSSProperties} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
              <span className="badge badge-primary" style={{ width: 'fit-content' }}>{h.eyebrow}</span>
              <h1 style={{ fontSize: 'clamp(2.4rem, 1.6rem + 3.4vw, 4.2rem)', letterSpacing: '-0.035em' }}>{h.heroTitle}</h1>
              <p className="lead" style={{ maxWidth: 560 }}>{h.heroDescription}</p>
              <div className="row">
                <Link to="/start" className="btn btn-primary btn-lg btn-mentor-highlight">
                  {h.ctaLabel} <ArrowRight size={18} aria-hidden />
                </Link>
                <a href="#paths" className="btn btn-lg">{h.secondaryCtaLabel}</a>
              </div>
              <p className="subtle">{content.brand.tagline} Free, and no account needed — your progress saves in your browser.</p>
            </motion.div>
            {h.heroImage ? (
              <img src={h.heroImage} alt="" style={{ borderRadius: 'var(--r-card)', boxShadow: 'var(--shadow-2)' }} />
            ) : (
              <HeroVisual />
            )}
          </div>
        </section>

        <section id="paths" className="page" aria-labelledby="paths-title">
          <Reveal className="stack" style={{ '--gap': '8px', marginBottom: 'var(--space-5)' } as CSSProperties}>
            <span className="eyebrow">Three learning paths</span>
            <h2 id="paths-title">Start where you actually are</h2>
            <p className="lead" style={{ maxWidth: 640 }}>Each level has its own roadmap, lessons, projects and career guidance. You can switch any time.</p>
          </Reveal>
          <div className="grid grid-3">
            {content.levels.map((l, i) => (
              <Reveal key={l.id} delay={i * 0.08}>
                <Link to={`/start?level=${l.id}`} className="card card-link stack" style={{ height: '100%', '--gap': '14px' } as CSSProperties}>
                  <LevelIllustration level={l.id} color={l.color} />
                  <div className="row-between">
                    <h3 style={{ color: `color-mix(in oklab, ${l.color} 80%, var(--c-text))` }}>{l.name}</h3>
                    <span className="subtle">{levelModules(l).length} modules · {levelLessons(l).length} lessons</span>
                  </div>
                  <strong>{l.headline}</strong>
                  <p className="muted">{l.description}</p>
                  <span className="row small" style={{ fontWeight: 600, color: 'var(--c-primary-text)', marginTop: 'auto' }}>
                    Start as {l.name} <ArrowRight size={16} aria-hidden />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="page" aria-labelledby="features-title">
          <Reveal className="stack" style={{ '--gap': '8px', marginBottom: 'var(--space-5)' } as CSSProperties}>
            <span className="eyebrow">How Designer Kid works</span>
            <h2 id="features-title">Skills, projects and a career plan in one place</h2>
          </Reveal>
          <div className="grid grid-3">
            {h.features.map((f, i) => (
              <Reveal key={f.id} delay={(i % 3) * 0.06}>
                <div className="card stack" style={{ height: '100%', '--gap': '10px' } as CSSProperties}>
                  <span className="icon-tile"><Icon name={f.icon} size={22} /></span>
                  <h3>{f.title}</h3>
                  <p className="muted">{f.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {h.stats.length > 0 && (
          <section className="page" aria-label="Designer Kid in numbers">
            <div className="card grid grid-4">
              {h.stats.map((s) => (
                <div key={s.id} className="stat">
                  <span className="stat-value">{s.value}</span>
                  <span className="stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {h.testimonials.length > 0 && (
          <section className="page" aria-labelledby="testimonials-title">
            <h2 id="testimonials-title" style={{ marginBottom: 'var(--space-5)' }}>What learners say</h2>
            <div className="grid grid-3">
              {h.testimonials.map((t) => (
                <figure key={t.id} className="card" style={{ margin: 0 }}>
                  <blockquote style={{ margin: 0, fontSize: '1.05rem' }}>“{t.quote}”</blockquote>
                  <figcaption className="row" style={{ marginTop: 16 }}>
                    {t.photo ? <img src={t.photo} alt="" className="avatar" /> : <span className="avatar">{t.name[0]}</span>}
                    <span>
                      <strong style={{ display: 'block' }}>{t.name}</strong>
                      <span className="small muted">{t.role}</span>
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        <ReviewsSection />

        {mentor.enabled && (
          <section className="page" aria-labelledby="mentor-title">
            <Reveal>
              <MentorSection id="mentor" />
            </Reveal>
          </section>
        )}

        <section className="page">
          <LatestPosts title="Latest from the blog" />
        </section>

        {h.faq.length > 0 && (
          <section className="page page-narrow" aria-labelledby="faq-title">
            <h2 id="faq-title" style={{ marginBottom: 'var(--space-5)' }}>Questions</h2>
            <div className="stack" style={{ '--gap': '10px' } as CSSProperties}>
              {h.faq.map((q) => (
                <details key={q.id} className="card card-tight faq">
                  <summary className="row-between" style={{ cursor: 'pointer', fontWeight: 600, listStyle: 'none', minHeight: 32 }}>
                    {q.question}
                    <ChevronDown size={18} aria-hidden className="faq-chevron" />
                  </summary>
                  <p className="muted" style={{ marginTop: 10 }}>{q.answer}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        <section className="page" style={{ textAlign: 'center' }}>
          <Reveal className="stack" style={{ alignItems: 'center', '--gap': '16px' } as CSSProperties}>
            <h2>Ready to find your starting point?</h2>
            <p className="lead">It takes less than a minute.</p>
            <div className="row" style={{ justifyContent: 'center' }}>
              <Link to="/start" className="btn btn-primary btn-lg btn-mentor-highlight">
                {h.ctaLabel} <ArrowRight size={18} aria-hidden />
              </Link>
            </div>
          </Reveal>
        </section>
      </main>
      <SiteFooter />
        </div>{/* landing-chrome__content */}
      </div>{/* landing-chrome__body */}
      <BottomRuler />
    </div>
  )
}
