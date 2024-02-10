import { config } from '@config'
import { Message as DiscordMessage } from 'discord.js'

const whiteSpacesRegex = '[\\s　]+'
const removeMention = /\s*(\<@&?\d+\>|@here|@everyone)\s*/
export type Message = {
  id: string
  message: string
  tweet: boolean
}
export const messageHandler = (message: DiscordMessage): Message => {
  const formatedMessage = message.content
    .trim()
    .replace(removeMention, '')
    .replace(new RegExp(`^${whiteSpacesRegex}`), '')
    .replace(new RegExp(`${whiteSpacesRegex}$`), '')
  return { id: message.id, message: formatedMessage, tweet: !hasMention(message) && !isBotMessage(message) }
}

const hasMention = (message: DiscordMessage): boolean => {
  return (
    message.mentions.users.size > 0 ||
    message.mentions.channels.size > 0 ||
    message.mentions.roles.size > 0 ||
    message.mentions.everyone
  )
}

const isBotMessage = (message: DiscordMessage): boolean => {
  console.log(message.author.id, config.discord.botUserId)
  return message.author.id === config.discord.botUserId
}
