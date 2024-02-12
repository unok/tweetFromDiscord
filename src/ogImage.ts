import ogs from 'open-graph-scraper'
import sharp from 'sharp'

export const get = async (url: string) => {
  const options = { url: url }
  const { result } = await ogs(options)
  if (!result.ogImage?.at(0)?.url) {
    return undefined
  }
  const res = await fetch(result.ogImage?.at(0)?.url || '')

  const buffer = await res.arrayBuffer()
  const comporessedImage = await sharp(buffer)
    .resize(800, null, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .jpeg({ quality: 80, progressive: true })
    .toBuffer()
  return {
    url: result.ogImage?.at(0)?.url || '',
    type: result.ogImage?.at(0)?.type || '',
    description: result.ogDescription || '',
    title: result.ogTitle || '',
    unit8Array: new Uint8Array(comporessedImage),
  }
}
