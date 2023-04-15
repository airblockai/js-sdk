export const chunk = <T>(arr: T[], size: number) => {
  const chunkSize = Math.max(size, 1)
  return arr.reduce<T[][]>((chunks, element, index) => {
    const chunkIndex = Math.floor(index / chunkSize)
    if (!chunks[chunkIndex]) {
      chunks[chunkIndex] = []
    }
    chunks[chunkIndex].push(element)
    return chunks
  }, [])
}
