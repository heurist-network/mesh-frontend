import { z } from 'zod';

export const baseAgentConfigSchema = z.object({
  agentId: z.string(),
});

export type BaseAgentConfig = z.infer<typeof baseAgentConfigSchema>;

export class BaseAgent {
  protected agentId: string;

  constructor(config: BaseAgentConfig) {
    const validated = baseAgentConfigSchema.parse(config);
    this.agentId = validated.agentId;
  }

  protected async makeRequest<T>(
    tool: string,
    input: Record<string, any> = {},
  ): Promise<T> {
    const apiKey = process.env.HEURIST_API_KEY;
    const apiUrl = process.env.HEURIST_API_URL;

    if (!apiKey) {
      throw new Error('HEURIST_API_KEY not found in environment');
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`[${this.agentId}] calling ${tool}`, {
        input,
        url: `${apiUrl}/mesh_request`,
      });
    }

    const response = await fetch(`${apiUrl}/mesh_request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agent_id: this.agentId,
        input: {
          tool,
          raw_data_only: true,
          tool_arguments: input,
        },
        api_key: apiKey,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`[${this.agentId}] ${tool} failed:`, error);
      throw new Error(`request failed: ${error}`);
    }

    const data = await response.json();
    if (process.env.NODE_ENV === 'development') {
      console.log(
        `[${this.agentId}] ${tool} response:`,
        JSON.stringify(data, null, 2),
      );
    }
    if (data.error) {
      console.error(`[${this.agentId}] ${tool} failed:`, data.error);
      throw new Error(data.error);
    }

    const result = data.data;
    return result;
  }
}
