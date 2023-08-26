import NextAuth from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
			  email: { label: "Email", type: "email", placeholder: "john@gmail.com" },
			  password: { label: "Password", type: "password" }
			},
			async authorize(credentials, req) {
				const resp = await fetch(`${process.env.DOMAIN}/api/login`, {
					method: 'POST',
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({
						email: credentials?.email,
						password: credentials?.password
					})
				})
		
				if (resp?.ok) {
					const user = await resp.json();
					return user;
				} else {
					return null;
				}
			}
		})
	]
})

export { handler as GET, handler as POST };