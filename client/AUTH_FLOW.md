# Client-Server Authentication Flow

## Overview
The Next.js client communicates with the backend server using cookie-based authentication. This ensures secure, SSR-compatible requests.

## Authentication Flow

### 1. Social Login Flow

```
[Client] → [NextAuth] → [Social Provider] → [NextAuth] → [Backend]
                                                ↓
                                          Token Exchange
                                                ↓
                                          [Set Cookies] → [Client]
```

**Steps:**
1. User clicks "Sign in with Google/Facebook/GitHub"
2. NextAuth handles OAuth redirect
3. Social provider returns access token
4. NextAuth exchanges social token with backend (`POST /auth/social`)
5. Backend validates and returns JWT token
6. NextAuth stores JWT in httpOnly cookie
7. All SSR requests include this cookie

### 2. Credentials Login Flow

```
[Client] → [NextAuth] → [Backend /auth/login] → [JWT Token] → [Set Cookie]
```

## Cookie Management

### Server-Side (SSR)

API client automatically forwards cookies:

```typescript
// lib/api/client.ts
const cookieStore = cookies();
const accessToken = cookieStore.get('access-token');

headers['Authorization'] = `Bearer ${accessToken.value}`;
headers['Cookie'] = cookieStore.getAll().map(...).join('; ');
```

### Middleware

Middleware sets access-token cookie from session:

```typescript
// middleware.ts
if (session?.accessToken) {
  response.cookies.set('access-token', session.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  });
}
```

## Backend Integration

Your backend should:

1. **Create social auth endpoint:**
```typescript
POST /auth/social
Body: {
  provider: 'google' | 'facebook' | 'github',
  access_token: string,
  profile: {...}
}
Response: {
  token: string,  // JWT
  userId: string
}
```

2. **Validate JWT on requests:**
```typescript
// Extract from Authorization header or Cookie
const token = req.headers.authorization?.replace('Bearer ', '');
const decoded = jwt.verify(token, SECRET);
```

3. **Logout endpoint:**
```typescript
POST /auth/logout
// Clear backend session
```

## Security Features

✅ **httpOnly Cookies** - Cannot be accessed by JavaScript
✅ **SameSite=lax** - CSRF protection
✅ **Secure in Production** - HTTPS only
✅ **Token Exchange** - Social tokens never stored client-side
✅ **Automatic Forwarding** - SSR includes auth automatically

## Testing

### 1. Start services
```bash
docker-compose up -d  # Start backend
cd client && npm run dev  # Start client
```

### 2. Sign in
Visit `http://localhost:3000/en/auth/signin`

### 3. Access protected route
Visit `http://localhost:3000/en/dashboard/products`

### 4. Verify cookies
Check browser DevTools → Application → Cookies:
- `next-auth.session-token`
- `access-token`

### 5. Check backend logs
Backend should receive requests with Authorization header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Environment Variables

```env
# Client
NEXTAUTH_SECRET=your-secret-32-chars-min
NEXT_PUBLIC_API_URL=http://localhost:3000

# Backend should match
NEXTAUTH_SECRET=same-secret-here
```

## Troubleshooting

**Issue**: 401 Unauthorized on API calls
- Check: `access-token` cookie exists
- Check: Backend validates token correctly
- Check: NEXTAUTH_SECRET matches on both sides

**Issue**: Redirect loop
- Check: Protected route logic in middleware.ts
- Check: Session exists after sign-in
- Check: Callback URL is correct

**Issue**: Cookies not sent
- Check: `credentials: 'include'` in fetch
- Check: `httpOnly: true` in cookie settings
- Check: Domain/path settings match
