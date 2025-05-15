import { getRecommendations } from "@/clients/neynar";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fid = searchParams.get("fid");

  if (!fid) {
    return NextResponse.json({ error: "fid is required" }, { status: 400 });
  }

  const recommendations = await getRecommendations(Number(fid));

  const response = NextResponse.json(recommendations);
  response.headers.set(
    "Cache-Control",
    "public, s-maxage=86400, stale-while-revalidate=43200"
  );

  return response;
}
