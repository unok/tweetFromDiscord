import { configDotenv } from 'dotenv'

configDotenv()
export const config: {
  discord: { token: string; botUserId: string; channelId: string; targetReaction: string }
  twitter: { userId: string; apiKey: string; apiKeySecret: string; accessToken: string; accessTokenSecret: string }
  bluesky: { identifier: string; appPassword: string }
} = {
  discord: {
    token: process.env.DISCORD_TOKEN,
    botUserId: process.env.DISCORD_BOT_USER_ID,
    channelId: process.env.DISCORD_CHANNEL_ID,
    targetReaction: process.env.DISCORD_TARGET_REACTION,
  },
  twitter: {
    userId: process.env.TWITTER_USER_ID,
    apiKey: process.env.TWITTER_API_KEY,
    apiKeySecret: process.env.TWITTER_API_KEY_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  },
  bluesky: {
    identifier: process.env.BLUESKY_IDENTIFIER,
    appPassword: process.env.BLUESKY_APP_PASSWORD,
  },
}
