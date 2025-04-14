import { apiCall, handleApiRequest } from '@/lib/api-utils';

export const GET = handleApiRequest(
  async () => {
    return apiCall({
      endpoint: 'https://mesh.heurist.ai/metadata.json',
      cacheOptions: {
        enabled: true,
        duration: 5 * 60 * 1000, // 5 minutes cache
        keyPrefix: 'agents'
      },
      headers: {
        Accept: 'application/json'
      }
    });
  },
  'Failed to fetch agents data'
);
