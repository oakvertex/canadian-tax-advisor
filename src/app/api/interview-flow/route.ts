import { NextResponse } from "next/server";
import interviewFlow from "../../../../taxonomy/2025/interview-flow.json";

export async function GET() {
  return NextResponse.json(interviewFlow);
}
