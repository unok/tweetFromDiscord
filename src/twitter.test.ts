import { Message } from '@discordHandler'
import { describe, expect, it, mock } from 'bun:test'
import { postTweet } from '@twitter'

const tweetId = '1000000000'
const accountId = 'unok'
mock.module('twitter-api-v2', () => {
  return {
    TwitterApi: mock((token: string) => {
      return {
        v2: {
          tweet: mock((tweet: string) => {
            return { data: { id: tweetId, user_id: accountId } }
          }),
        },
      }
    }),
  }
})
describe('Twitter', () => {
  it('tweet and url response', async () => {
    const message: Message = { id: 'aaaabbbbcccc', message: 'Hello World!', tweet: true }
    expect(await postTweet(message)).toEqual(`https://twitter.com/${accountId}/status/${tweetId}`)
  })
})
