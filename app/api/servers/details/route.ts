import type { NextRequest } from 'next/server';
import { apiCall, handleApiRequest, validateAuthHeader } from '@/lib/api-utils';

const API_BASE_URL = 'https://sequencer-v2.heurist.xyz/provision';

export const POST = handleApiRequest(
  async (request: NextRequest) => {
    const authHeader = validateAuthHeader(request);
    const body = await request.json();
    
    return apiCall({
      endpoint: 'servers/details',
      method: 'POST',
      baseUrl: API_BASE_URL,
      headers: {
        Authorization: authHeader,
      },
      body,
    });
  },
  'Failed to get server details'
);
