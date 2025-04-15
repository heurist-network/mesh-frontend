import { NextResponse, type NextRequest } from 'next/server';

interface ApiErrorResponse {
  error: string;
  details?: unknown;
}

interface ApiCallOptions {
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: object;
  headers?: Record<string, string>;
  baseUrl?: string;
  requireAuth?: boolean;
  cacheOptions?: {
    enabled: boolean;
    duration?: number;
    keyPrefix?: string;
  };
}

// cache storage
const apiCache: Record<string, { data: any; timestamp: number }> = {};
const DEFAULT_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function apiCall<T>({
  endpoint,
  method = 'GET',
  body,
  headers = {},
  baseUrl,
  requireAuth = false,
  cacheOptions,
}: ApiCallOptions): Promise<T> {
  // generate cache key if caching is enabled
  const cacheKey = cacheOptions?.enabled
    ? `${cacheOptions.keyPrefix || ''}:${endpoint}:${method}`
    : null;

  // check cache first
  if (cacheKey && apiCache[cacheKey]) {
    const cached = apiCache[cacheKey];
    const now = Date.now();
    const cacheDuration = cacheOptions?.duration || DEFAULT_CACHE_DURATION;

    if (now - cached.timestamp < cacheDuration) {
      return cached.data;
    }
  }

  try {
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers,
    };

    const requestOptions: RequestInit = {
      method,
      headers: requestHeaders,
      redirect: 'follow',
    };

    if (body && (method === 'POST' || method === 'PUT')) {
      requestOptions.body = JSON.stringify(body);
    }

    const url = baseUrl ? `${baseUrl}/${endpoint}` : endpoint;
    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}${
          errorData ? ` - ${JSON.stringify(errorData)}` : ''
        }`,
      );
    }

    const data = await response.json();

    // store in cache if enabled
    if (cacheKey) {
      apiCache[cacheKey] = {
        data,
        timestamp: Date.now(),
      };
    }

    return data;
  } catch (error) {
    console.error(`API error (${endpoint}):`, error);
    throw error;
  }
}

export function handleApiRequest<T>(
  handler: (request: NextRequest) => Promise<T>,
  errorMessage: string,
) {
  return async (request: NextRequest) => {
    try {
      const result = await handler(request);
      return NextResponse.json(result);
    } catch (error) {
      console.error('API error:', error);
      const errorResponse: ApiErrorResponse = { error: errorMessage };

      if (error instanceof Error) {
        errorResponse.details = error.message;
      }

      return NextResponse.json(errorResponse, { status: 500 });
    }
  };
}

export function validateAuthHeader(request: NextRequest): string {
  const authHeader = request.headers.get('Authorization');

  if (!authHeader) {
    throw new Error('Authorization header is required');
  }

  return authHeader;
}
