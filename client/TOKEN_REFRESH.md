# Token Refresh Architecture

## Overview

This client implements a **secure token refresh pattern** with:
- **Access Token**: Short-lived (15 minutes), sent as `Authorization: Bearer {token}`
- **Refresh Token**: Long-lived (7 days), stored in httpOnly cookie `rfToken`

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Authentication Flow                       │
└─────────────────────────────────────────────────────────────────┘

1. User Login
   Client → Backend /auth/login
   ← Response: { accessToken, expiresIn }, Set-Cookie: rfToken=xxx

2. API Request (Token Valid)
   Client → Backend /api/products
   Headers: Authorization: Bearer {accessToken}
   ← Response: { data }

3. API Request (Token Expired)
   Client → Backend /api/products
   Headers: Authorization: Bearer {expired-token}
   ← Response: 401 Unauthorized
   
   Client → Backend /auth/refresh
   Headers: Cookie: rfToken=xxx
   ← Response: { accessToken, expiresIn }
   
   Client → Backend /api/products (Retry)
   Headers: Authorization: Bearer {new-accessToken}
   ← Response: { data }
```

## Token Lifecycle

### Access Token
- **Lifetime**: 15 minutes (900 seconds)
- **Storage**: In-memory cache (server-side only)
- **Transmission**: `Authorization: Bearer {token}` header
- **Auto-refresh**: When expired or 1 minute before expiry

### Refresh Token (rfToken)
- **Lifetime**: 7 days
- **Storage**: httpOnly cookie (immune to XSS)
- **Transmission**: Automatically sent in Cookie header
- **Only used for**: `/auth/refresh` endpoint

## Implementation Details

### 1. API Client Auto-Refresh

```typescript
// lib/api/client.ts
async function getAccessToken(): Promise<string | null> {
  // Check cache
  if (cachedAccessToken && tokenExpiry && Date.now() < tokenExpiry - 60000) {
    return cachedAccessToken;
  }
  
  // Auto-refresh if expired
  return await refreshAccessToken();
}
```

### 2. Automatic Retry on 401

```typescript
if (response.status === 401) {
  // Try to refresh
  const newAccessToken = await refreshAccessToken();
  
  if (newAccessToken) {
    // Retry request with new token
    return retryResponse;
  }
  
  throw new Error('Unauthorized');
}
```

### 3. Backend Integration

Your backend must implement these endpoints:

#### POST /auth/login
```typescript
Request:
{
  email: string,
  password: string
}

Response:
{
  accessToken: string,    // JWT, expires in 15min
  expiresIn: 900,        // seconds
  userId: string,
  email: string
}

Set-Cookie: rfToken=xxx; HttpOnly; Secure; SameSite=Strict; Max-Age=604800
```

#### POST /auth/social
```typescript
Request:
{
  provider: 'google' | 'facebook' | 'github',
  access_token: string,
  profile: {...}
}

Response:
{
  accessToken: string,
  expiresIn: 900,
  userId: string
}

Set-Cookie: rfToken=xxx; HttpOnly; Secure; SameSite=Strict; Max-Age=604800
```

#### POST /auth/refresh
```typescript
Request Headers:
Cookie: rfToken=xxx

Response:
{
  accessToken: string,
  expiresIn: 900
}

// Optionally rotate refresh token:
Set-Cookie: rfToken=new-token; HttpOnly; Secure; SameSite=Strict; Max-Age=604800
```

#### POST /auth/logout
```typescript
Request Headers:
Cookie: rfToken=xxx

Response:
{ success: true }

Set-Cookie: rfToken=; Max-Age=0  // Clear cookie
```

## Security Benefits

✅ **XSS Protection**: Refresh token in httpOnly cookie
✅ **CSRF Protection**: SameSite cookie attribute
✅ **Token Rotation**: New refresh token on each refresh (optional)
✅ **Short Access Token**: Limited damage if leaked
✅ **Automatic Refresh**: Seamless UX
✅ **Server-Side Only**: Access token never exposed to browser

## Cookie Configuration

```typescript
// Backend should set:
{
  name: 'rfToken',
  httpOnly: true,           // Cannot be accessed by JavaScript
  secure: true,             // HTTPS only in production
  sameSite: 'strict',       // CSRF protection
  maxAge: 7 * 24 * 60 * 60, // 7 days
  path: '/'
}
```

## Token Format (JWT)

### Access Token Payload
```json
{
  "userId": "uuid",
  "email": "user@example.com",
  "role": "user",
  "iat": 1234567890,
  "exp": 1234568790  // 15 minutes later
}
```

### Refresh Token Payload
```json
{
  "userId": "uuid",
  "tokenId": "unique-token-id",  // For revocation
  "iat": 1234567890,
  "exp": 1235172690  // 7 days later
}
```

## Best Practices

1. **Always use HTTPS** in production
2. **Rotate refresh tokens** on each refresh
3. **Revoke tokens** on logout
4. **Store token blacklist** for revoked tokens
5. **Monitor failed refresh attempts** for security
6. **Use short access token lifetime** (5-15 minutes)
7. **Refresh proactively** before expiry (1 minute buffer)

## Testing

### 1. Test Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}' \
  -c cookies.txt
```

### 2. Test API with Access Token
```bash
curl http://localhost:3000/api/products \
  -H "Authorization: Bearer {accessToken}" \
  -b cookies.txt
```

### 3. Test Refresh
```bash
curl -X POST http://localhost:3000/auth/refresh \
  -b cookies.txt
```

### 4. Test Logout
```bash
curl -X POST http://localhost:3000/auth/logout \
  -b cookies.txt
```

## Troubleshooting

**Issue**: Infinite refresh loop
- **Cause**: Backend not returning valid tokens
- **Fix**: Check `/auth/refresh` response format

**Issue**: 401 after refresh
- **Cause**: rfToken expired or invalid
- **Fix**: User must re-login

**Issue**: Cookies not sent
- **Cause**: SameSite or domain mismatch
- **Fix**: Ensure client and API on same domain or use proper CORS

**Issue**: Token refresh fails in SSR
- **Cause**: Cookie not available in server context
- **Fix**: Ensure `credentials: 'include'` in all fetch calls
