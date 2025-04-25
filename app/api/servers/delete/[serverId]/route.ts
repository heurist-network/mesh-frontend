import type { NextRequest } from 'next/server';
import {
  apiCall,
  validateAuthHeader,
  handleRouteExecution,
} from '@/lib/api-utils';

const API_BASE_URL = 'https://sequencer-v2.heurist.xyz/provision';

export async function DELETE(
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
      endpoint: `servers/delete/${serverId}`,
      method: 'DELETE',
      baseUrl: API_BASE_URL,
      headers: {
        Authorization: authHeader,
      },
    });
  }, 'Failed to delete server');
}
