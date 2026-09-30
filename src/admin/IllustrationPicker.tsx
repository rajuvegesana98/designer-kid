import { Illustration, ILLUSTRATION_LABELS, ILLUSTRATION_NAMES } from '../components/illustrationLibrary'
import type { IllustrationName } from '../content/types'

/** Visual gallery of the themed illustrations. */
export function IllustrationPicker({ value, onChange, allowAuto }: { value?: IllustrationName; onChange: (v: IllustrationName | undefined) => void; allowAuto?: boolean }) {
  return (
    <div className="field">
      <span className="label">Illustration</span>
      <div className="illus-grid" role="radiogroup" aria-label="Illustration">
        {allowAuto && (
          <button type="button" role="radio" aria-checked={!value} className="illus-option illus-auto" onClick={() => onChange(undefined)}>
            <span>Auto</span>
            <small>Matches the topic</small>
          </button>
        )}
        {ILLUSTRATION_NAMES.map((n) => (
          <button key={n} type="button" role="radio" aria-checked={value === n} className="illus-option" onClick={() => onChange(n)} title={ILLUSTRATION_LABELS[n]}>
            <Illustration name={n} title="" />
            <small>{ILLUSTRATION_LABELS[n]}</small>
          </button>
        ))}
      </div>
    </div>
  )
}
