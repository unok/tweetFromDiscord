import { postBluesky } from '@bluesky'
import { Message } from '@discordHandler'
import { describe, expect, it, mock } from 'bun:test'

const identifier = 'test.bsky.social'

mock.module('@atproto/api', () => ({
  BskyAgent: mock(({ service: string }) => {
    return {
      login: async () => Promise<void>,
      post: async (data: { test: string; langs: string[]; createdAt: Date }) => {
        return { uri: 'at://did:plc:u5cwb2mwiv2bfq53cjufe6yn/app.bsky.feed.post/3k4duaz5vfs2b', cid: '123' }
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
