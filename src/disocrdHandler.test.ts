/*
- discordの特定のチャンネルのメッセージを取得する
   - チャンネルに接続する
   - メッセージを待つ
*/
import { describe, it, expect } from 'bun:test'
import { messageHandler, isTargetReaction } from '@discordHandler'
import { Channel, Collection, Message, MessageMentions, MessageReaction, Role, User } from 'discord.js'
const mentions: Partial<MessageMentions> = {
  users: new Collection<string, User>([]),
  channels: new Collection<string, Channel>([]),
  roles: new Collection<string, Role>([]),
  everyone: false,
}

describe('メッセージの受け取り', () => {
  it('メッセージを受け取る', () => {
    const mockUser: Partial<User> = {
      id: 'testUser',
      username: 'testuser',
      tag: 'testUser#0000',
      toString: () => '<@testUser>',
      valueOf: () => 'testUser',
    }

    const message = {
      id: '1234567890',
      author: mockUser as User,
      channelId: '5678901234',
      content: 'test message',
      mentions: mentions,
    } as Message
    expect(messageHandler(message)).toStrictEqual({ id: message.id, message: message.content, tweet: true })
  })
})

describe('メッセージのフォーマット', () => {
  it('前後のホワイトスペースを削除する', () => {
    const mockUser: Partial<User> = {
      id: 'testUser',
      username: 'testuser',
      tag: 'testUser#0000',
      toString: () => '<@testUser>',
      valueOf: () => 'testUser',
    }

    const message = {
      author: mockUser as User,
      content: '  test message  　 ',
      channelId: '5678901234',
      mentions: mentions,
    } as Message
    expect(messageHandler(message)).toStrictEqual({ id: message.id, message: 'test message', tweet: true })
  })
})

describe('メンション入のメッセージは投稿しない', () => {
  it('Userメンション入のメッセージは投稿しない', () => {
    const mockUser: Partial<User> = {
      id: 'testUser',
      username: 'testuser',
      tag: 'testUser#0000',
      toString: () => '<@testUser>',
      valueOf: () => 'testUser',
    }
    const userId = mockUser.id ?? 'unknownUserId'
    const message: Message = {
      id: '1234567890',
      channelId: '5678901234',
      content: '<@0000000> test message',
      author: mockUser as User,
      mentions: { ...mentions, users: new Collection<string, User>([[userId, mockUser as User]]) } as MessageMentions,
    } as Partial<Message<boolean>> as Message<boolean>
    expect(messageHandler(message)).toStrictEqual({ id: message.id, message: 'test message', tweet: false })
  })
  it('Channelメンション入のメッセージは投稿しない', () => {
    const mockUser: Partial<User> = {
      id: 'testUser',
      username: 'testuser',
      tag: 'testUser#0000',
      toString: () => '<@testUser>',
      valueOf: () => 'testUser',
    }

    const mockChannel: Partial<Channel> = {
      id: 'testChannel',
      toString: () => '<@testUser>',
      valueOf: () => 'testUser',
    }
    const channelId = mockChannel.id ?? 'unknownChannelId'
    const message: Message = {
      id: '1234567890',
      author: mockUser as User,
      channelId: '5678901234',
      content: '@here test message',
      mentions: {
        ...mentions,
        channels: new Collection<string, Channel>([[channelId, mockChannel as Channel]]),
      } as MessageMentions,
    } as Partial<Message<boolean>> as Message<boolean>
    expect(messageHandler(message)).toStrictEqual({ id: message.id, message: 'test message', tweet: false })
  })
  it('Roleメンション入のメッセージは投稿しない', () => {
    const mockUser: Partial<User> = {
      id: 'testUser',
      username: 'testuser',
      tag: 'testUser#0000',
      toString: () => '<@testUser>',
      valueOf: () => 'testUser',
    }

    const mockRole: Partial<Role> = {
      id: 'testRole',
      toString: () => '<@&testRole>',
      valueOf: () => 'testRole',
    }
    const roleId = mockRole.id ?? 'unknownRoleId'
    const message: Message = {
      id: '1234567890',
      author: mockUser as User,
      channelId: '5678901234',
      content: '<@&0000000> test message',
      mentions: {
        ...mentions,
        roles: new Collection<string, Role>([[roleId, mockRole as Role]]),
      } as MessageMentions,
    } as Partial<Message<boolean>> as Message<boolean>
    expect(messageHandler(message)).toStrictEqual({ id: message.id, message: 'test message', tweet: false })
  })
  it('Everyoneメンション入のメッセージは投稿しない', () => {
    const message: Message = {
      id: '1234567890',
      channelId: '5678901234',
      content: '@everyone test message',
      mentions: {
        ...mentions,
        everyone: true,
      } as MessageMentions,
    } as Partial<Message<boolean>> as Message<boolean>
    expect(messageHandler(message)).toStrictEqual({ id: message.id, message: 'test message', tweet: false })
  })
})
describe('自分のメッセージには反応しない', () => {
  it('自分のメッセージには反応しない', () => {
    const mockUser: Partial<User> = {
      id: 'botUserId',
      username: 'botUserId',
      tag: 'botUserId#00002',
      toString: () => '<@botUserId>',
      valueOf: () => 'botUserId',
    }
    const userId = mockUser.id ?? 'unknownUserId'
    const message: Message = {
      id: '1234567890',
      author: mockUser as User,
      channelId: '5678901234',
      content: 'test message',
      mentions: { ...mentions } as MessageMentions,
    } as Partial<Message<boolean>> as Message<boolean>
    expect(messageHandler(message)).toStrictEqual({ id: message.id, message: 'test message', tweet: false })
  })
  it('他人のメッセージには反応する', () => {
    const mockUser: Partial<User> = {
      id: 'testUser',
      username: 'testuser',
      tag: 'testUser#00001',
      toString: () => '<@testUser>',
      valueOf: () => 'testUser',
    }
    const userId = mockUser.id ?? 'unknownUserId'
    const message: Message = {
      id: '1234567890',
      content: 'test message',
      channelId: '5678901234',
      author: mockUser as User,
      mentions: { ...mentions } as MessageMentions,
    } as Partial<Message<boolean>> as Message<boolean>
    expect(messageHandler(message)).toStrictEqual({ id: message.id, message: 'test message', tweet: true })
  })
})

describe('特定のチャンネルのみ反応する', () => {
  const mockUser: Partial<User> = {
    id: 'testUser',
    username: 'testuser',
    tag: 'testUser#00001',
    toString: () => '<@testUser>',
    valueOf: () => 'testUser',
  }

  it('特定のチャンネルなので反応する', () => {
    const message = {
      author: mockUser as User,
      channelId: '5678901234',
      content: 'test message',
      mentions: mentions,
    } as Message
    expect(messageHandler(message)).toStrictEqual({ id: message.id, message: 'test message', tweet: true })
  })
  it('特定のチャンネルなので反応する', () => {
    const message = {
      author: mockUser as User,
      channelId: '1234567890',
      content: 'test message',
      mentions: mentions,
    } as Message
    expect(messageHandler(message)).toStrictEqual({ id: message.id, message: 'test message', tweet: false })
  })
})

describe('リアクションが指定したリアクションかチェック', () => {
  it('指定したリアクションである', () => {
    const reaction = { emoji: { name: '✅' } } as MessageReaction
    expect(isTargetReaction(reaction)).toBe(true)
  })
  it('指定したリアクションではない', () => {
    const reaction = { emoji: { name: '⭐' } } as MessageReaction
    expect(isTargetReaction(reaction)).toBe(false)
  })
})
