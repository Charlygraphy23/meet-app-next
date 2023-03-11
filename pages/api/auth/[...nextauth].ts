import NextAuth, { Session, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { signIn } from "next-auth/react";

export default NextAuth({
	providers: [
		GoogleProvider({
			clientId: process.env.HD_GOOGLE_CLIENT_ID || "",
			clientSecret: process.env.HD_GOOGLE_CLIENT_SECRET || "",
			authorization: {
				params: {
					prompt: "consent",
					access_type: "offline",
					response_type: "code",
				},
			},
		}),
	],
	secret: process.env.HD_NEXTAUTH_SECRET,
});
