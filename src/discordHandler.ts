import { config } from '@config'
import { Message as DiscordMessage, MessageReaction, PartialMessageReaction } from 'discord.js'

const limitLength = 140

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

  if (isOverLengthLimit(formatedMessage)) {
    throw new Error(`文字数が${limitLength}文字を超えています: ${formatedMessage.length}文字です`)
  }

  return {
    id: message.id,
    message: formatedMessage,
    tweet: isTargetChannel(message) && !hasMention(message) && !isBotMessage(message),
  }
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
  return message.author.id === config.discord.botUserId
}

const isTargetChannel = (message: DiscordMessage): boolean => {
  console.log(message.channelId, config.discord.channelId)
  return message.channelId === config.discord.channelId
}

export const isTargetReaction = (reaction: MessageReaction | PartialMessageReaction) => {
  return reaction.emoji.name === config.discord.targetReaction
}

const isOverLengthLimit = (message: string): boolean => {
  return message.length > limitLength
}
