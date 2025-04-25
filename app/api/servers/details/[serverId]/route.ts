import type { NextRequest } from 'next/server';
import {
  apiCall,
  validateAuthHeader,
  handleRouteExecution,
} from '@/lib/api-utils';

const API_BASE_URL = 'https://sequencer-v2.heurist.xyz/provision';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ serverId: string }> },
) {
  return handleRouteExecution(async () => {
    const authHeader = validateAuthHeader(request);
    const { serverId } = await context.params;

    if (!serverId) {
      throw new Error('Server ID is missing');
    }

    return apiCall({
      endpoint: `servers/details/${serverId}`,
      baseUrl: API_BASE_URL,
      headers: {
        Authorization: authHeader,
      },
    });
  }, 'Failed to get server details');
}
