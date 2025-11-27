# Next.js Client Application

Production-ready Next.js 15 client with SSR, i18n, social authentication, and observability.

## Features

✅ **Next.js 15** with App Router
✅ **Server-Side Rendering** (SSR) for all pages
✅ **Internationalization** (English & Vietnamese)
✅ **Social Authentication** (Google, Facebook, GitHub)
✅ **Tailwind CSS** + **shadcn/ui** components
✅ **Logging** with Pino + Loki integration
✅ **Tracing** with OpenTelemetry
✅ **Docker** standalone mode for production

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Build

```bash
npm run build
npm start
```

## Docker

```bash
docker build -t nextjs-client .
docker run -p 3000:3000 nextjs-client
```

## Environment Variables

Copy `.env.local` and configure:

- `NEXT_PUBLIC_API_URL` - BFF API URL
- `LOKI_URL` - Loki server URL
- `NEXTAUTH_SECRET` - NextAuth secret key
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`
- `FACEBOOK_CLIENT_ID` & `FACEBOOK_CLIENT_SECRET`
- `GITHUB_CLIENT_ID` & `GITHUB_CLIENT_SECRET`

## Project Structure

```
client/
├── app/
│   ├── [locale]/              # i18n routes
│   │   ├── (dashboard)/       # Protected routes
│   │   │   └── products/      # Products page
│   │   └── auth/              # Auth pages
│   └── api/auth/              # NextAuth API
├── components/
│   ├── ui/                    # shadcn components
│   └── auth/                  # Auth components
├── lib/
│   ├── api/                   # API client
│   └── logger/                # Logging
├── messages/                  # Translations
└── middleware.ts              # i18n middleware
```

## Technologies

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui
- NextAuth.js
- Pino (logging)
- OpenTelemetry (tracing)
