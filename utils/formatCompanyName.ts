const KNOWN_ACRONYMS = new Set([
  'TNHH',
  'CP',
  'MTV',
  'JSC',
  'LLC',
  'STEM',
  'STEAM',
  'IELTS',
  'TOEIC',
  'THCS',
  'THPT',
  'HN',
  'HN1',
  'HCM',
  'TP-EDU',
  'NBK',
  'VINCONS',
  'GNP',
  'VNG',
  'FPT',
  'EDUFIT',
  'EDU',
  'VTC',
  'VTV',
  'VN',
  'VND',
])

export function formatCompanyName(name?: string | null): string {
  if (!name) return ''
  const trimmed = name.trim()
  if (!trimmed) return ''

  // If already contains lowercase letters, user intentionally typed it that way
  const hasLowerCase = /[a-zà-ỹ]/i.test(trimmed) && trimmed !== trimmed.toUpperCase()
  if (hasLowerCase) {
    return trimmed
  }

  // If ALL-CAPS (e.g. from business registry import), convert to clean Title Case
  return trimmed
    .split(/\s+/)
    .map((word) => {
      const cleanUpper = word.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '').toUpperCase()
      if (KNOWN_ACRONYMS.has(cleanUpper)) return word.toUpperCase()
      if (/^[A-Z0-9]{2,4}$/.test(cleanUpper) && !/[AEIOUY]/.test(cleanUpper)) return word.toUpperCase()

      return word.replace(/(\p{L})(\p{L}*)/gu, (_, first: string, rest: string) => first.toUpperCase() + rest.toLowerCase())
    })
    .join(' ')
}
