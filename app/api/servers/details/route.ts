import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = 'https://sequencer-v2.heurist.xyz/provision';

// POST handler for getting server details
export async function POST(request: NextRequest) {
  try {
    // Get the Authorization header from the incoming request
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { error: "Authorization header is required" },
        { status: 401 }
      );
    }

    // Get the request body
    const body = await request.json();

    // Forward the request to the external API
    const response = await fetch(`${API_BASE_URL}/servers/details`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        `Failed to get server details: ${response.status} ${response.statusText}${
          errorData ? ` - ${JSON.stringify(errorData)}` : ''
        }`
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Failed to get server details" },
      { status: 500 }
    );
  }
}
