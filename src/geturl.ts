export const getUrl = (text: string) => {
  const url = text.match(/https?:\/\/[!-~]+/)
  if (!url) {
    return undefined
  }
  return url[0]
}
