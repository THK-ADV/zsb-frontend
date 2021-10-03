export function buildCustomFilter<T>(concatenatedString: (t: T) => string): (affiliation: T, filter: string) => boolean {
  return (affiliation: T, filter: string) => {
    const keywords = filter.split(',').map(it => it.trim().toLowerCase())
    let keywordsFound = true
    keywords.forEach(keyword => {
      if (!concatenatedString(affiliation).toLowerCase().includes(keyword)) {
        keywordsFound = false
      }
    })
    return keywordsFound
  }
}
