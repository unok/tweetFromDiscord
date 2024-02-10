import { postBluesky } from '@bluesky'
import { config } from '@config'
import { messageHandler } from '@discordHandler'
import { postTweet } from '@twitter'
import { Client, GatewayIntentBits as Intents, Events } from 'discord.js'

const discordClient = new Client({
  intents: [Intents.Guilds, Intents.GuildMessages, Intents.GuildMessageReactions, Intents.MessageContent],
})

discordClient.once(Events.ClientReady, (c) => {
  console.log(`Ready! ${c.user?.tag}`)
})

discordClient.on(Events.MessageCreate, async (message) => {
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
})

discordClient.login(config.discord.token)
