import { config } from '@config'
import { Message } from '@discordHandler'
import { TwitterApi } from 'twitter-api-v2'

export const postTweet = async (message: Message): Promise<string> => {
  if (!message.message) {
    throw new Error('Tweet message is required')
  }
  const client = new TwitterApi({
    appKey: config.twitter.apiKey,
    appSecret: config.twitter.apiKeySecret,
    accessToken: config.twitter.accessToken,
    accessSecret: config.twitter.accessTokenSecret,
  })
  const { data: tweet } = await client.v2.tweet(message.message)
  return `https://twitter.com/${config.twitter.userId}/status/${tweet.id}`
}
