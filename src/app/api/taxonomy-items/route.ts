import { NextResponse } from "next/server";
import items from "../../../../taxonomy/2025/items.json";

export async function GET() {
  return NextResponse.json(items);
}
