import { logger } from '../logger';
import { cookies } from 'next/headers';

interface TokenResponse {
  accessToken: string;
  expiresIn: number;
}

let cachedAccessToken: string | null = null;
let tokenExpiry: number | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const cookieStore = cookies();
  const refreshToken = cookieStore.get('rfToken');

  if (!refreshToken) {
    logger.warn('No refresh token available');
    return null;
  }

  try {
    logger.info({ type: 'token_refresh', message: 'Attempting to refresh access token' });

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `rfToken=${refreshToken.value}`
      },
      credentials: 'include'
    });

    if (!response.ok) {
      logger.error({ type: 'token_refresh_failed', status: response.status });
      return null;
    }

    const data: TokenResponse = await response.json();

    // Cache the new access token and its expiry
    cachedAccessToken = data.accessToken;
    tokenExpiry = Date.now() + (data.expiresIn * 1000);

    logger.info({
      type: 'token_refreshed',
      expiresIn: data.expiresIn
    });

    return data.accessToken;
  } catch (error) {
    logger.error({
      type: 'token_refresh_error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    return null;
  }
}

async function getAccessToken(): Promise<string | null> {
  // Check if cached token is still valid
  if (cachedAccessToken && tokenExpiry && Date.now() < tokenExpiry - 60000) {
    // Token valid for at least 1 more minute
    return cachedAccessToken;
  }

  // Token expired or about to expire, refresh it
  return await refreshAccessToken();
}

export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`;

  // Get access token (will auto-refresh if needed)
  const accessToken = await getAccessToken();

  // Get cookies from server-side context
  const cookieStore = cookies();

  // Build headers with authentication
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options?.headers,
  };

  // Add access token as Bearer token
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  // Forward refresh token cookie
  const refreshToken = cookieStore.get('rfToken');
  if (refreshToken) {
    headers['Cookie'] = `rfToken=${refreshToken.value}`;
  }

  logger.info({
    type: 'api_request',
    endpoint,
    method: options?.method || 'GET',
    hasAuth: !!accessToken
  });

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
      cache: 'no-store'
    });

    // Handle token expiration
    if (response.status === 401) {
      logger.warn({ type: 'unauthorized', endpoint });

      // Try to refresh and retry once
      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        headers['Authorization'] = `Bearer ${newAccessToken}`;

        // Retry request with new token
        const retryResponse = await fetch(url, {
          ...options,
          headers,
          credentials: 'include',
          cache: 'no-store'
        });

        if (retryResponse.ok) {
          const data = await retryResponse.json();
          logger.info({ type: 'api_response_retry_success', endpoint });
          return data;
        }
      }

      throw new Error('Unauthorized: Please sign in again');
    }

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    logger.info({
      type: 'api_response',
      endpoint,
      status: response.status
    });

    return data;
  } catch (error) {
    logger.error({
      type: 'api_error',
      endpoint,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    throw error;
  }
}

// Specific API methods
export const productApi = {
  getAll: (page: number = 1, limit: number = 10) =>
    apiClient(`/products?page=${page}&limit=${limit}`, { method: 'GET' }),

  getById: (id: string) =>
    apiClient(`/products/${id}`, { method: 'GET' }),

  create: (data: any) =>
    apiClient('/products', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  update: (id: string, data: any) =>
    apiClient(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  delete: (id: string) =>
    apiClient(`/products/${id}`, { method: 'DELETE' })
};
