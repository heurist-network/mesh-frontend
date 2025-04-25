import type { NextRequest } from 'next/server';
import {
  apiCall,
  validateAuthHeader,
  handleRouteExecution,
} from '@/lib/api-utils';

const API_BASE_URL = 'https://sequencer-v2.heurist.xyz/provision';

export async function POST(request: NextRequest) {
  return handleRouteExecution(async () => {
    const authHeader = validateAuthHeader(request);
    const body = await request.json();

    return apiCall({
      endpoint: 'servers/create',
      method: 'POST',
      baseUrl: API_BASE_URL,
      headers: {
        Authorization: authHeader,
      },
      body,
    });
  }, 'Failed to create server');
}
