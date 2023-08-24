import NextAuth from 'next-auth/next';
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
	providers: [
		CredentialsProvider({
			// The name to display on the sign in form (e.g. "Sign in with...")
			name: "Credentials",
			// `credentials` is used to generate a form on the sign in page.
			// You can specify which fields should be submitted, by adding keys to the `credentials` object.
			// e.g. domain, username, password, 2FA token, etc.
			// You can pass any HTML attribute to the <input> tag through the object.
			credentials: {
			  username: { label: "Username", type: "text", placeholder: "jsmith" },
			  password: { label: "Password", type: "password" }
			},
			async authorize(credentials, req) {
			  // Add logic here to look up the user from the credentials supplied
			  const resp = await fetch('api/signin', {
				method: 'POST',
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					username: credentials?.username,
					password: credentials?.password
				})
			  })

			  console.log("RESP 1", resp)
		
			  if (!resp.ok) {
				// If you return null then an error will be displayed advising the user to check their details.
				return null
			  } else {
				console.log("RESP 2", resp)
				// Any object returned will be saved in `user` property of the JWT
				const user = await resp.json();
				console.log("RETURNED USER", user)
				return user;
				// You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
			  }
			}
		})
	]
})

export { handler as GET, handler as POST };