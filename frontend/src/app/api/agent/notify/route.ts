import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/agent/notify
 * 
 * Receives notifications from the frontend when users execute investments.
 * This allows the agent to monitor and log user activities.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      event: string;
      strategy: string;
      txHash: string;
      user: string;
      timestamp: string;
    };

    // Log the event (in production, this could write to a database or message queue)
    console.log("[Agent Notification]", {
      event: body.event,
      strategy: body.strategy,
      txHash: body.txHash,
      user: body.user,
      timestamp: body.timestamp
    });

    // In a real implementation, you could:
    // 1. Store this in a database
    // 2. Send to a monitoring service
    // 3. Trigger agent analysis
    // 4. Update user portfolio tracking

    return NextResponse.json({
      ok: true,
      message: "Notification received",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("[Agent Notification Error]", error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Failed to process notification"
      },
      { status: 500 }
    );
  }
}
