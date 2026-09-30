import { motion } from 'motion/react'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import type { BookmarkKind } from '../data'
import { useLearner } from '../state/learner'
import { useToast } from '../state/ui'

export function BookmarkButton({ kind, id, title, compact }: { kind: BookmarkKind; id: string; title: string; compact?: boolean }) {
  const { isBookmarked, toggleBookmark } = useLearner()
  const toast = useToast()
  const saved = isBookmarked(kind, id)
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.9 }}
      className={`btn ${compact ? 'btn-ghost btn-icon btn-sm' : 'btn-sm'} ${saved ? 'btn-soft' : ''}`}
      aria-pressed={saved}
      aria-label={compact ? `${saved ? 'Remove bookmark' : 'Bookmark'}: ${title}` : undefined}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggleBookmark(kind, id)
        toast(saved ? 'Removed from bookmarks' : 'Saved to My Bookmarks')
      }}
    >
      {saved ? <BookmarkCheck size={18} aria-hidden /> : <Bookmark size={18} aria-hidden />}
      {!compact && (saved ? 'Bookmarked' : 'Bookmark')}
    </motion.button>
  )
}
