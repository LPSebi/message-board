import { PrismaAdapter } from "@next-auth/prisma-adapter"
import {
    getServerSession,
    type DefaultSession,
    type NextAuthOptions,
} from "next-auth"
import DiscordProvider, {
    type DiscordProfile,
} from "next-auth/providers/discord"

import { env } from "~/env"
import { db } from "~/server/db"
// Importing a specific API version

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
    interface Session extends DefaultSession {
        user: {
            id: string
        } & DiscordProfile &
            DefaultSession["user"]
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface Profile extends DiscordProfile {}

    // interface User {
    //   // ...other properties
    //   // role: UserRole;
    // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
    callbacks: {
        session: async ({ session, user }) => {
            // get discord user id from db
            const discordId = await db.user.findUnique({
                where: { id: user.id },
                select: { accounts: { select: { providerAccountId: true } } },
            })
            console.log("discordId", discordId?.accounts[0]?.providerAccountId)
            // fetch new avatar from discord
            const discordUser = (await fetch(
                `https://discord.com/api/v9/users/${discordId?.accounts[0]?.providerAccountId}`,
                {
                    headers: {
                        Authorization: `Bot ${env.DISCORD_BOT_TOKEN}`,
                    },
                }
            ).then((res) => res.json())) as DiscordProfile
            console.log("discordUser", discordUser)
            // send new avatar to db
            await db.user
                .update({
                    where: { id: user.id },
                    data: {
                        image: `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`,
                    },
                })
                .then(() => {
                    console.log("avatar updated")
                    console.log(
                        "userImage",
                        `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
                    )
                })
            console.log("userImage", user.image)
            return {
                ...session,
                user: {
                    ...session.user,
                    id: user.id,
                },
            }
        },
    },
    adapter: PrismaAdapter(db),
    providers: [
        DiscordProvider({
            clientId: env.DISCORD_CLIENT_ID,
            clientSecret: env.DISCORD_CLIENT_SECRET,
        }),
        /**
         * ...add more providers here.
         *
         * Most other providers require a bit more work than the Discord provider. For example, the
         * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
         * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
         *
         * @see https://next-auth.js.org/providers/github
         */
    ],
}

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions)
