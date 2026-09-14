import { readQueueProgress } from "@/lib/admission";

export async function GET(request: Request) {
  const queueToken = new URL(request.url).searchParams.get("token");
  const progress = queueToken ? readQueueProgress(queueToken, Date.now()) : undefined;

  if (!progress) {
    return Response.json(
      { message: "The demo queue token is invalid." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  return Response.json(progress, { headers: { "Cache-Control": "no-store" } });
}
