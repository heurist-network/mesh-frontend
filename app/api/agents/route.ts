import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const res = await fetch('https://mesh.heurist.ai/metadata.json', {
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch agents data' },
        { status: res.status },
      );
    }

    return NextResponse.json(await res.json());
  } catch (error) {
    console.error('Error fetching agents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agents data' },
      { status: 500 },
    );
  }
}
