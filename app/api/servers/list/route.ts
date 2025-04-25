import type { NextRequest } from 'next/server';
import {
  apiCall,
  validateAuthHeader,
  handleRouteExecution,
} from '@/lib/api-utils';

const API_BASE_URL = 'https://sequencer-v2.heurist.xyz/provision';

export async function GET(request: NextRequest) {
  return handleRouteExecution(async () => {
    const authHeader = validateAuthHeader(request);

    return apiCall({
      endpoint: 'servers/list',
      baseUrl: API_BASE_URL,
      headers: {
        Authorization: authHeader,
      },
    });
  }, 'Failed to list servers');
}
