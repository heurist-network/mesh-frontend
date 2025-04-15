import type { NextRequest } from 'next/server';
import { apiCall, handleApiRequest, validateAuthHeader } from '@/lib/api-utils';

const API_BASE_URL = 'https://sequencer-v2.heurist.xyz/provision';

export const GET = handleApiRequest(async (request: NextRequest) => {
  const authHeader = validateAuthHeader(request);

  return apiCall({
    endpoint: 'servers',
    baseUrl: API_BASE_URL,
    headers: {
      Authorization: authHeader,
    },
  });
}, 'Failed to list servers');

export const POST = handleApiRequest(async (request: NextRequest) => {
  const authHeader = validateAuthHeader(request);
  const body = await request.json();

  return apiCall({
    endpoint: 'servers',
    method: 'POST',
    baseUrl: API_BASE_URL,
    headers: {
      Authorization: authHeader,
    },
    body,
  });
}, 'Failed to create server');
