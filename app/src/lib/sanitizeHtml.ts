const ALLOWED_TAGS = new Set([
  'p',
  'br',
  'strong',
  'em',
  'b',
  'i',
  'ul',
  'ol',
  'li',
  'a',
])

export function sanitizeHtml(html: string): string {
  return html
    .replace(/<(\/?)(\w+)[^>]*>/g, (match, closing, tag) => {
      const lower = tag.toLowerCase()
      if (!ALLOWED_TAGS.has(lower)) {
        return ''
      }
      if (lower === 'a' && !closing) {
        const hrefMatch = match.match(/href\s*=\s*["']([^"']+)["']/i)
        if (hrefMatch) {
          const href = hrefMatch[1]
          if (/^https?:\/\//i.test(href) || /^mailto:/i.test(href)) {
            return `<a href="${href}" rel="noopener noreferrer" target="_blank">`
          }
        }
        return '' // strip unsafe <a> tags
      }
      if (lower === 'br') {
        return '<br>'
      }
      return `<${closing}${lower}>`
    })
    .trim()
}
