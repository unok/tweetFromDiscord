import { postBluesky } from '@bluesky'
import { config } from '@config'
import { isTargetReaction, messageHandler } from '@discordHandler'
import { postTweet } from '@twitter'
import { Client, GatewayIntentBits as Intents, Events, Message } from 'discord.js'

const discordClient = new Client({
  intents: [Intents.Guilds, Intents.GuildMessages, Intents.GuildMessageReactions, Intents.MessageContent],
})

discordClient.once(Events.ClientReady, (c) => {
  console.log(`Ready! ${c.user?.tag}`)
})

discordClient.on(Events.MessageReactionAdd, async (reaction) => {
  if (!isTargetReaction(reaction)) {
    return
  }
  const message = reaction.message as Message
  try {
    const result = messageHandler(message)
    console.log(result)
    if (!result.tweet) return

    const tweetUrl = await postTweet(result)
    message.reply({
      content: `Posted on Twitter: ${tweetUrl}`,
    })
    await message.react('🐦')

    const blueskyUrl = await postBluesky(result)
    message.reply({
      content: `Posted on BlueSky: ${blueskyUrl}`,
    })
    await message.react('🦋')
  } catch (e: unknown) {
    console.log(e)
    if (e instanceof Error) {
      message.reply({
        content: e.message,
      })
    } else {
      message.reply({
        content: 'エラーが発生しました',
      })
    }
  }
})

discordClient.login(config.discord.token)
