import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Backend',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Call backend authentication endpoint
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" },
          credentials: 'include' // Important: receive rfToken cookie
        });

        const data = await res.json();

        if (res.ok && data) {
          // Backend should set rfToken cookie in response
          // We just return user data
          return {
            id: data.userId,
            email: data.email,
            name: data.name,
            accessToken: data.accessToken, // Short-lived token
          };
        }
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, account, profile, user }) {
      // On sign in, handle social login
      if (account && account.provider !== 'credentials') {
        token.provider = account.provider;

        // Exchange social token for backend tokens
        try {
          const backendRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/social`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // Receive rfToken cookie
            body: JSON.stringify({
              provider: account.provider,
              access_token: account.access_token,
              profile: profile
            })
          });

          if (backendRes.ok) {
            const backendData = await backendRes.json();
            // Backend returns accessToken and sets rfToken cookie
            token.accessToken = backendData.accessToken;
            token.userId = backendData.userId;
          }
        } catch (error) {
          console.error('Failed to exchange token with backend:', error);
        }
      }

      // For credentials login, store the access token
      if (user?.accessToken) {
        token.accessToken = user.accessToken;
        token.userId = user.id;
      }

      return token;
    },
    async session({ session, token }) {
      // Pass access token to session (will be used by middleware)
      return {
        ...session,
        accessToken: token.accessToken as string,
        provider: token.provider as string,
        userId: token.userId as string,
      };
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days (matches refresh token)
  },
  events: {
    async signIn({ user, account }) {
      console.log('User signed in:', user.email);
    },
    async signOut() {
      // Clear backend session and rfToken cookie
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
          method: 'POST',
          credentials: 'include' // Send rfToken for revocation
        });
      } catch (error) {
        console.error('Failed to logout from backend:', error);
      }
    }
  }
});

export { handlers as GET, handlers as POST };
