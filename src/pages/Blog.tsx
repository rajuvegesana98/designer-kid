import { ArrowLeft, ArrowRight, Clock, Download, Share2 } from 'lucide-react'
import { useState, type CSSProperties } from 'react'
import { Link, useParams, useSearchParams } from 'react-router'
import { Blocks, FileCard } from '../components/Blocks'
import { Illustration } from '../components/illustrationLibrary'
import { MentorLink, useMentor } from '../components/MentorLink'
import { EmptyState, formatDate, PageHeader, Reveal } from '../components/ui'
import type { BlogPost } from '../content/types'
import { useContent } from '../state/content'
import { useToast } from '../state/ui'
import { usePageTitle } from '../lib/usePageTitle'

export function sortPosts(posts: BlogPost[]) {
  return [...posts].sort((a, b) => b.date.localeCompare(a.date))
}

function Cover({ post, big }: { post: BlogPost; big?: boolean }) {
  if (post.coverImage) return <img src={post.coverImage} alt="" loading="lazy" className="blog-cover-img" style={big ? { maxHeight: 420 } : undefined} />
  if (post.cover) return <Illustration name={post.cover} title="" />
  return null
}

export function BlogCard({ post, featured }: { post: BlogPost; featured?: boolean }) {
  return (
    <Link to={`/blog/${post.slug}`} className={`card card-link blog-card ${featured ? 'blog-card-featured' : ''}`}>
      <div className="blog-card-cover"><Cover post={post} /></div>
      <div className="stack" style={{ '--gap': '8px', padding: featured ? 'var(--space-5)' : 'var(--space-4)' } as CSSProperties}>
        <div className="chip-group" style={{ gap: 6 }}>
          {post.tags.slice(0, 3).map((t) => <span key={t} className="badge">{t}</span>)}
        </div>
        <h2 style={{ fontSize: featured ? '1.6rem' : '1.15rem' }}>{post.title}</h2>
        <p className="muted small clamp-2" style={{ display: '-webkit-box' }}>{post.excerpt}</p>
        <span className="meta">
          <span>{formatDate(post.date)}</span>
          <span><Clock size={14} aria-hidden /> {post.minutes} min read</span>
        </span>
      </div>
    </Link>
  )
}

export function BlogIndex() {
  const { content } = useContent()
  const [params, setParams] = useSearchParams()
  const tag = params.get('tag')
  const [q, setQ] = useState('')
  const posts = sortPosts(content.blog ?? [])
  const tags = [...new Set(posts.flatMap((p) => p.tags))].sort()
  const filtered = posts.filter((p) => (!tag || p.tags.includes(tag)) && `${p.title} ${p.excerpt} ${p.tags.join(' ')}`.toLowerCase().includes(q.toLowerCase()))
  const featured = !tag && !q ? filtered.find((p) => p.featured) : undefined
  usePageTitle('Blog')
  const rest = filtered.filter((p) => p !== featured)

  return (
    <div className="page">
      <PageHeader eyebrow="Blog" title="Notes from the studio">
        Practical articles on UI/UX craft, Figma, portfolios and design careers.
      </PageHeader>
      <div className="row" style={{ marginBottom: 'var(--space-5)' }}>
        <input className="input" style={{ maxWidth: 320 }} aria-label="Search articles" placeholder="Search articles" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="chip-group" role="radiogroup" aria-label="Filter by tag">
          <button type="button" role="radio" className="chip" aria-checked={!tag} onClick={() => setParams({}, { replace: true })}>All</button>
          {tags.map((t) => (
            <button key={t} type="button" role="radio" className="chip" aria-checked={tag === t} onClick={() => setParams({ tag: t }, { replace: true })}>{t}</button>
          ))}
        </div>
      </div>
      {filtered.length === 0 ? (
        <EmptyState icon="BookOpen" title={posts.length ? 'No articles match' : 'No articles yet'}>{posts.length ? 'Try another tag or search.' : 'Check back soon.'}</EmptyState>
      ) : (
        <>
          {featured && (
            <Reveal style={{ marginBottom: 'var(--space-5)' }}>
              <BlogCard post={featured} featured />
            </Reveal>
          )}
          <div className="grid grid-3">
            {rest.map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) * 0.05}>
                <BlogCard post={p} />
              </Reveal>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export function BlogPostPage() {
  const { slug } = useParams()
  const { content } = useContent()
  const mentor = useMentor()
  const toast = useToast()
  const posts = sortPosts(content.blog ?? [])
  const post = posts.find((p) => p.slug === slug)
  usePageTitle(post?.title)
  if (!post)
    return (
      <div className="page">
        <EmptyState icon="BookOpen" title="Article not found" action={<Link to="/blog" className="btn btn-primary">All articles</Link>}>It may have been moved or unpublished.</EmptyState>
      </div>
    )
  const related = posts.filter((p) => p.id !== post.id && p.tags.some((t) => post.tags.includes(t))).slice(0, 3)

  const share = async () => {
    const url = window.location.href
    try {
      if (navigator.share) await navigator.share({ title: post.title, url })
      else {
        await navigator.clipboard.writeText(url)
        toast('Link copied')
      }
    } catch {
      /* cancelled */
    }
  }

  return (
    <div className="page page-narrow">
      <Link to="/blog" className="btn btn-ghost btn-sm" style={{ marginBottom: 'var(--space-4)', marginLeft: -12 }}>
        <ArrowLeft size={16} aria-hidden /> All articles
      </Link>
      <article aria-labelledby="post-title">
        <header className="stack" style={{ '--gap': '14px', marginBottom: 'var(--space-6)' } as CSSProperties}>
          <div className="chip-group" style={{ gap: 6 }}>
            {post.tags.map((t) => <Link key={t} to={`/blog?tag=${encodeURIComponent(t)}`} className="badge" style={{ textDecoration: 'none' }}>{t}</Link>)}
          </div>
          <h1 id="post-title" style={{ fontSize: 'clamp(2rem, 1.4rem + 2.4vw, 3rem)' }}>{post.title}</h1>
          <p className="lead">{post.excerpt}</p>
          <div className="row-between">
            <span className="meta">
              <span>By {post.author}</span>
              <span>{formatDate(post.date)}</span>
              <span><Clock size={14} aria-hidden /> {post.minutes} min read</span>
            </span>
            <span className="row" style={{ '--gap': '6px' } as CSSProperties}>
              <button className="btn btn-sm" onClick={share}><Share2 size={15} aria-hidden /> Share</button>
              <Link to={`/print/blog/${post.id}`} className="btn btn-sm"><Download size={15} aria-hidden /> PDF</Link>
            </span>
          </div>
          <div className="blog-hero"><Cover post={post} big /></div>
        </header>
        <Blocks blocks={post.blocks} />
        {!!post.attachments?.length && (
          <section className="stack" style={{ marginTop: 'var(--space-6)', '--gap': '8px' } as CSSProperties}>
            <h2 style={{ fontSize: '1.2rem' }}>Downloads</h2>
            {post.attachments.map((f) => <FileCard key={f.url} file={f} />)}
          </section>
        )}
      </article>
      {mentor.available && (
        <div className="card tinted row" style={{ marginTop: 'var(--space-7)', gap: 'var(--space-4)' }}>
          <div className="grow" style={{ minWidth: 220 }}>
            <strong>Want personal feedback on this?</strong>
            <p className="small muted">Book a 1:1 with {mentor.name}.</p>
          </div>
          <MentorLink className="btn btn-primary" />
        </div>
      )}
      {related.length > 0 && (
        <section style={{ marginTop: 'var(--space-7)' }}>
          <div className="row-between" style={{ marginBottom: 'var(--space-4)' }}>
            <h2 style={{ fontSize: '1.3rem' }}>Keep reading</h2>
            <Link to="/blog" className="btn btn-ghost btn-sm">All articles <ArrowRight size={15} aria-hidden /></Link>
          </div>
          <div className="grid grid-3">{related.map((p) => <BlogCard key={p.id} post={p} />)}</div>
        </section>
      )}
    </div>
  )
}

/** "From the blog" strip for the homepage and dashboard. */
export function LatestPosts({ title = 'From the blog', count = 3 }: { title?: string; count?: number }) {
  const { content } = useContent()
  const posts = sortPosts(content.blog ?? []).slice(0, count)
  if (!posts.length) return null
  return (
    <section aria-labelledby="latest-posts-title">
      <div className="row-between" style={{ marginBottom: 'var(--space-4)' }}>
        <h2 id="latest-posts-title" style={{ fontSize: '1.35rem' }}>{title}</h2>
        <Link to="/blog" className="btn btn-ghost btn-sm">All articles <ArrowRight size={15} aria-hidden /></Link>
      </div>
      <div className="grid grid-3">
        {posts.map((p, i) => (
          <Reveal key={p.id} delay={i * 0.05}>
            <BlogCard post={p} />
          </Reveal>
        ))}
      </div>
    </section>
  )
}
