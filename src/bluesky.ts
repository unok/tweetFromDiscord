import { BskyAgent } from '@atproto/api'
import { config } from '@config'
import { Message } from '@discordHandler'

export const postBluesky = async (message: Message) => {
  if (!message.tweet) {
    throw new Error('Message is not a tweet')
  }
  const agent = new BskyAgent({ service: 'https://bsky.social' })
  await agent.login({ identifier: config.bluesky.identifier, password: config.bluesky.appPassword })
  const { uri } = await agent.post({ text: message.message })
  const id = uri.split('/').pop()

  return `https://bsky.app/profile/${config.bluesky.identifier}/post/${id}`
}
