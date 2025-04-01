import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch(
      'https://mesh.heurist.ai/mesh_agents_metadata.json',
      {
        headers: {
          Accept: 'application/json',
        },
        redirect: 'follow',
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch agents: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agents data' },
      { status: 500 },
    );
  }
}
