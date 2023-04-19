export const domainWithoutSubdomain = (domain: string) => {
  const parts = domain.split('.')

  if (parts.length <= 2) {
    return domain
  }

  return parts.slice(parts.length - 2, parts.length).join('.')
}
