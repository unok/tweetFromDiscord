namespace NodeJS {
  interface ProcessEnv {
    readonly DISCORD_TOKEN: string
    readonly DISCORD_BOT_USER_ID: string
    readonly DISCORD_CHANNEL_ID: string
    readonly DISCORD_TARGET_REACTION: string
    readonly TWITTER_USER_ID: string
    readonly TWITTER_API_KEY: string
    readonly TWITTER_API_KEY_SECRET: string
    readonly TWITTER_ACCESS_TOKEN: string
    readonly TWITTER_ACCESS_TOKEN_SECRET: string
    readonly BLUESKY_IDENTIFIER: string
    readonly BLUESKY_APP_PASSWORD: string
  }
}
