import {
  Award, BadgeCheck, BookOpen, Bookmark, Brain, Briefcase, Boxes, Compass, Crown, FileText, Flag, Flame, Footprints, Gem,
  GraduationCap, Heart, History, Layers, Library, Lock, StickyNote, LayoutDashboard, LayoutTemplate, IdCard, Lightbulb, Map, Medal, MessagesSquare, Mountain,
  Palette, PenTool, Puzzle, Rocket, Route, Search, Shapes, Sparkles, Sprout, Star, Target, TrendingUp, Trophy, Users, Wand2,
  Zap, type LucideIcon, type LucideProps,
} from 'lucide-react'

/**
 * Icons that admin-managed content can reference by name. Kept to a curated
 * set so we don't bundle the whole icon library.
 */
export const ICONS: Record<string, LucideIcon> = {
  Award, BadgeCheck, BookOpen, Bookmark, Brain, Briefcase, Boxes, Compass, Crown, FileText, Flag, Flame, Footprints, Gem,
  GraduationCap, Heart, History, Layers, Library, Lock, StickyNote, LayoutDashboard, LayoutTemplate, IdCard, Lightbulb, Map, Medal, MessagesSquare, Mountain,
  Palette, PenTool, Puzzle, Rocket, Route, Search, Shapes, Sparkles, Sprout, Star, Target, TrendingUp, Trophy, Users, Wand2, Zap,
}

export const ICON_NAMES = Object.keys(ICONS).sort()

export function Icon({ name, ...props }: { name: string } & LucideProps) {
  const Cmp = ICONS[name] ?? Sparkles
  return <Cmp aria-hidden="true" {...props} />
}
