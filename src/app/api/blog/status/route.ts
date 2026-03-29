import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "running",
    next_scheduled: "09:00 daily",
    recipient: "paul@designedforhumans.tech",
    timestamp: new Date().toISOString(),
  });
}
