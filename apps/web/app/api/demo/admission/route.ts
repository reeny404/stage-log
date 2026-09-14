import { decideAdmission, type AdmissionScenario } from "@/lib/admission";

const scenarios: AdmissionScenario[] = ["healthy", "surge", "dependency-failure"];

export async function POST(request: Request) {
  const idempotencyKey = request.headers.get("x-idempotency-key");
  if (!idempotencyKey) {
    return Response.json(
      { message: "An idempotency key is required." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  const body = (await request.json().catch(() => undefined)) as
    | { eventId?: string; scenario?: AdmissionScenario }
    | undefined;

  if (!body?.eventId || !body.scenario || !scenarios.includes(body.scenario)) {
    return Response.json(
      { message: "A valid event and demo scenario are required." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  const decision = decideAdmission(body.eventId, idempotencyKey, body.scenario, Date.now());
  if (decision.status === "degraded") {
    return Response.json(decision, {
      status: 503,
      headers: {
        "Cache-Control": "no-store",
        "Retry-After": decision.retryAfterSeconds.toString(),
      },
    });
  }

  return Response.json(decision, { headers: { "Cache-Control": "no-store" } });
}
