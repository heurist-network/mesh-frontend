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
}

export async function apiCall<T>({
  endpoint,
  method = 'GET',
  body,
  headers = {},
  baseUrl,
}: ApiCallOptions): Promise<T> {
  try {
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers,
    };

    const requestOptions: RequestInit = {
      method,
      headers: requestHeaders,
    };

    if (body && (method === 'POST' || method === 'PUT')) {
      requestOptions.body = JSON.stringify(body);
    }

    const url = baseUrl ? `${baseUrl}/${endpoint}` : endpoint;
    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}${errorData ? ` - ${JSON.stringify(errorData)}` : ''}`,
      );
    }

    return response.json();
  } catch (error) {
    console.error(`API error (${endpoint}):`, error);
    throw error;
  }
}

export function validateAuthHeader(request: NextRequest): string {
  const authHeader = request.headers.get('Authorization');

  if (!authHeader) {
    throw new Error('Authorization header is required');
  }

  return authHeader;
}

export async function handleRouteExecution<T>(
  logic: () => Promise<T>, // core logic callback
  errorMessage: string,
): Promise<NextResponse> {
  try {
    const result = await logic();
    return NextResponse.json(result);
  } catch (error) {
    console.error('API error:', error);
    const errorResponse: ApiErrorResponse = { error: errorMessage };

    // check if it's an auth error from validateAuthHeader
    if (error instanceof Error) {
      errorResponse.details = error.message;
      if (error.message === 'Authorization header is required') {
        return NextResponse.json(errorResponse, { status: 401 }); // unauthorized
      }
    }

    // generic server error
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
