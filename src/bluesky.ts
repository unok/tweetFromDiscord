import { BskyAgent, RichText } from '@atproto/api'
import { config } from '@config'
import { Message } from '@discordHandler'
import { getUrl } from '@geturl'
import { get } from '@ogImage'

const getAgent = async (): Promise<BskyAgent> => {
  const agent = new BskyAgent({ service: 'https://bsky.social' })
  await agent.login({ identifier: config.bluesky.identifier, password: config.bluesky.appPassword })
  return agent
}

export const postBluesky = async (message: Message) => {
  if (!message.tweet) {
    throw new Error('Message is not a tweet')
  }
  const richText = new RichText({ text: message.message })
  const agent = await getAgent()
  await richText.detectFacets(agent)

  const postOption: Parameters<BskyAgent['post']>[0] = { text: richText.text, facets: richText.facets }

  const embed = await getEmbed(message)
  if (embed) {
    postOption.embed = embed
  }

  const { uri } = await agent.post(postOption)
  const id = uri.split('/').pop()

  return `https://bsky.app/profile/${config.bluesky.identifier}/post/${id}`
}

const getEmbed = async (message: Message) => {
  const url = getUrl(message.message)
  if (!url) return
  const og = await get(url)
  if (!og) return
  const agent = await getAgent()
  const response = await agent.uploadBlob(og.unit8Array, { encoding: 'image/jpeg' })
  return {
    $type: 'app.bsky.embed.external',
    external: {
      uri: url,
      thumb: {
        $type: 'blob',
        ref: { $link: response.data.blob.ref.toString() },
        mimeType: response.data.blob.mimeType,
        size: response.data.blob.size,
      },
      title: og.title,
      description: og.description,
    },
  }
}
