import { Link } from 'react-router'
import { useContent } from '../state/content'

/** Logo: admin-uploaded image, or the default "DK" mark drawn as a selected frame. */
export function BrandMark({ size = 36 }: { size?: number }) {
  const { raw } = useContent()
  if (raw.brand.logoUrl)
    return (
      <span className="brand-mark" style={{ width: size, height: size, background: 'transparent' }}>
        <img src={raw.brand.logoUrl} alt="" />
      </span>
    )
  return (
    <span className="brand-mark" style={{ width: size, height: size }} aria-hidden="true">
      <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 24 24" fill="none">
        <rect x="3.5" y="3.5" width="17" height="17" rx="4" stroke="currentColor" strokeWidth="1.6" strokeDasharray="3 2.2" />
        <rect x="1.5" y="1.5" width="4" height="4" rx="1" fill="var(--c-primary)" />
        <rect x="18.5" y="18.5" width="4" height="4" rx="1" fill="var(--c-secondary)" />
        <path d="M8.5 15.5 12 8l3.5 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}

export function Brand({ to = '/' }: { to?: string }) {
  const { raw } = useContent()
  return (
    <Link to={to} className="brand" aria-label={`${raw.brand.name} home`}>
      <BrandMark />
      <span className="brand-text">
        <span className="brand-name" style={{ display: 'block' }}>{raw.brand.name}</span>
        <span className="brand-tag">{raw.brand.tagline}</span>
      </span>
    </Link>
  )
}
