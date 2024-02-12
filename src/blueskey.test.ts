import { AppBskyFeedPost } from '@atproto/api'
import { postBluesky } from '@bluesky'
import { Message } from '@discordHandler'
import { beforeAll, describe, expect, it, mock } from 'bun:test'

const identifier = 'test.bsky.social'

mock.module('@atproto/api', () => ({
  BskyAgent: mock(({ service: string }) => {
    return {
      login: async () => Promise<void>,
      post: async (data: { text: object; fasets: object; embed?: object }) => {
        return { uri: 'at://did:plc:u5cwb2mwiv2bfq53cjufe6yn/app.bsky.feed.post/3k4duaz5vfs2b', cid: '123' }
      },
      imageUpload: async ({ image, encoding }: { image: Uint8Array; encoding: string }) => {
        return { $link: 'https://image.url/image.url', mimeType: 'image/jpeg', size: 123456 }
      },
    }
  }),
}))
describe('Blueskey', () => {
  it('should create a new post', async () => {
    const message: Message = { id: 'aaaabbbbcccc', message: 'Hello World!', tweet: true }
    expect(await postBluesky(message)).toEqual(`https://bsky.app/profile/${identifier}/post/3k4duaz5vfs2b`)
  })
})
