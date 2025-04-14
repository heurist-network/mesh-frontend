// MCP Provisioner API service

interface CreateServerRequest {
  server_type: string;
  agents: string[];
}

interface ServerResponse {
  server_id: string;
  endpoint: string;
  mcp_endpoint: string;
}

interface ServerDetailsResponse extends ServerResponse {
  docker_image: string;
  container_name: string;
  server_type_exe: string;
  base_port: string;
  path_prefix: string;
  traefik_network: string;
  host_domain: string;
  supported_agents: string | string[];
}

interface ListServersResponse {
  servers: ServerResponse[];
}

interface DeleteServerResponse {
  success: boolean;
  message: string;
}

// Use relative API routes instead of direct external API calls to avoid CORS issues
const API_BASE_URL = '/api';

/**
 * Create a new MCP server with specified agents
 */
export async function createServer(
  apiKey: string,
  agents: string[],
): Promise<ServerResponse> {
  const response = await fetch(`${API_BASE_URL}/servers`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      server_type: 'tool',
      agents,
    } as CreateServerRequest),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      `Failed to create server: ${response.status} ${response.statusText}${
        errorData ? ` - ${JSON.stringify(errorData)}` : ''
      }`,
    );
  }

  return response.json();
}

/**
 * List all active servers for the current user
 */
export async function listServers(
  apiKey: string,
): Promise<ListServersResponse> {
  const response = await fetch(`${API_BASE_URL}/servers`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      `Failed to list servers: ${response.status} ${response.statusText}${
        errorData ? ` - ${JSON.stringify(errorData)}` : ''
      }`,
    );
  }

  return response.json();
}

/**
 * Get details for a specific server
 */
export async function getServerDetails(
  apiKey: string,
  serverId: string,
): Promise<ServerDetailsResponse> {
  const response = await fetch(`${API_BASE_URL}/servers/details`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      server_id: serverId,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      `Failed to get server details: ${response.status} ${response.statusText}${
        errorData ? ` - ${JSON.stringify(errorData)}` : ''
      }`,
    );
  }

  return response.json();
}

/**
 * Delete a specific server
 */
export async function deleteServer(
  apiKey: string,
  serverId: string,
): Promise<DeleteServerResponse> {
  const response = await fetch(`${API_BASE_URL}/servers/delete`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      server_id: serverId,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      `Failed to delete server: ${response.status} ${response.statusText}${
        errorData ? ` - ${JSON.stringify(errorData)}` : ''
      }`,
    );
  }

  return response.json();
}
