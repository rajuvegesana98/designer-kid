import type { IllustrationName } from '../content/types'

/**
 * Picks a themed cover illustration from a lesson's title and module, so every
 * lesson has a visual even before an admin chooses one. Order matters: the
 * first matching rule wins.
 */
const RULES: [RegExp, IllustrationName][] = [
  [/\bui vs ux|what is ux|what is ui|product design(er)?\b/i, 'ui-vs-ux'],
  [/design thinking|design process|user-centred|iteration|workflow|end-to-end/i, 'design-process'],
  [/hierarchy/i, 'visual-hierarchy'],
  [/spacing|alignment|auto layout/i, 'spacing'],
  [/grid|layout|responsive system|constraints/i, 'layout-grid'],
  [/typograph|type scale|text\b/i, 'typography'],
  [/colou?r|contrast/i, 'colour'],
  [/accessib/i, 'accessibility'],
  [/token|variable|design system|governance|contribution|versioning|adoption|naming|documentation/i, 'design-system'],
  [/component|variant|button|card|style|librar/i, 'components'],
  [/frame|layer|shape|image|figma|dev mode/i, 'figma'],
  [/prototyp|handoff/i, 'prototype'],
  [/persona/i, 'persona'],
  [/usability|testing/i, 'usability-test'],
  [/research|interview planning|synthesis|insight|affinity|competitive|qualitative|quantitative|discovery/i, 'research'],
  [/flow|journey|information architecture|navigation|taxonomy|search|filter|permission|multi-role|enterprise/i, 'user-flow'],
  [/wireframe/i, 'wireframe'],
  [/dashboard|table|metric|data/i, 'dashboard'],
  [/mobile|app\b|login|onboarding/i, 'mobile'],
  [/form|error|empty|loading|state/i, 'wireframe'],
  [/case stud|portfolio|storytelling|present(ing)? (research|wireframes|final)/i, 'portfolio'],
  [/resume|cv\b/i, 'resume'],
  [/linkedin|headline|about section|featured/i, 'linkedin'],
  [/interview|take-home|exercise|critique of an app/i, 'interview'],
  [/network|recruiter|personal brand|thought leadership/i, 'networking'],
  [/job|application|salary|negotiat/i, 'job-search'],
  [/strategy|business|goal|prioriti|opportunit|experiment|decision|problem/i, 'strategy'],
  [/critique|mentor|review|stakeholder|leadership|managing|pm|engineer|feedback|team/i, 'leadership'],
  [/senior|lead designer|staff|career/i, 'career-growth'],
]

const MODULE_FALLBACK: [RegExp, IllustrationName][] = [
  [/fundamental/i, 'ui-vs-ux'],
  [/figma/i, 'figma'],
  [/ux|research/i, 'research'],
  [/ui|advanced-ui/i, 'components'],
  [/project|workflow/i, 'design-process'],
  [/portfolio/i, 'portfolio'],
  [/career/i, 'career-growth'],
  [/ia/i, 'user-flow'],
  [/system/i, 'design-system'],
  [/strategy|product/i, 'strategy'],
  [/leader/i, 'leadership'],
]

export function coverFor(title: string, moduleId = '', explicit?: IllustrationName): IllustrationName {
  if (explicit) return explicit
  for (const [re, name] of RULES) if (re.test(title)) return name
  for (const [re, name] of MODULE_FALLBACK) if (re.test(moduleId)) return name
  return 'design-process'
}
