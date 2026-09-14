"use client";

import { track } from "@stagelog/analytics";
import { useEffect, useRef, useState } from "react";
import type { AdmissionDecision, AdmissionScenario, QueueProgress } from "@/lib/admission";

type GatewayState =
  | { status: "idle" }
  | { status: "checking" }
  | { status: "queued"; queueToken: string; peopleAhead: number }
  | { status: "admitted"; passId: string }
  | { status: "degraded"; message: string };

const scenarioOptions: Array<{
  id: AdmissionScenario;
  label: string;
  description: string;
}> = [
  { id: "healthy", label: "Normal", description: "Capacity is available" },
  { id: "surge", label: "Peak surge", description: "Admission queue activates" },
  {
    id: "dependency-failure",
    label: "Failure drill",
    description: "Admission dependency is unavailable",
  },
];

function createRequestId() {
  return typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `request-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function EventGateway({ eventId }: { eventId: string }) {
  const [scenario, setScenario] = useState<AdmissionScenario>("surge");
  const [gateway, setGateway] = useState<GatewayState>({ status: "idle" });
  const requestId = useRef<string>("");

  useEffect(() => {
    if (gateway.status !== "queued") return;

    const timeout = window.setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/demo/admission/status?token=${encodeURIComponent(gateway.queueToken)}`,
          { cache: "no-store" },
        );
        if (!response.ok) throw new Error("Queue status unavailable");

        const progress = (await response.json()) as QueueProgress;
        if (progress.status === "admitted") {
          setGateway(progress);
          track("admission_completed", { eventId, scenario, outcome: "admitted" });
          return;
        }

        setGateway({
          status: "queued",
          queueToken: gateway.queueToken,
          peopleAhead: progress.peopleAhead,
        });
      } catch {
        setGateway({
          status: "degraded",
          message: "Your place is safe. We could not refresh it, so you can retry without rejoining.",
        });
        track("admission_completed", { eventId, scenario, outcome: "degraded" });
      }
    }, 800);

    return () => window.clearTimeout(timeout);
  }, [eventId, gateway, scenario]);

  const runScenario = async () => {
    requestId.current = requestId.current || createRequestId();
    setGateway({ status: "checking" });
    track("admission_requested", { eventId, scenario });

    try {
      const response = await fetch("/api/demo/admission", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-idempotency-key": requestId.current,
        },
        body: JSON.stringify({ eventId, scenario }),
      });
      const decision = (await response.json()) as AdmissionDecision;

      if (decision.status === "degraded" || !response.ok) {
        setGateway({
          status: "degraded",
          message: "Entry is temporarily paused. Your request key is preserved for a safe retry.",
        });
        track("admission_completed", { eventId, scenario, outcome: "degraded" });
        return;
      }

      if (decision.status === "admitted") {
        setGateway(decision);
        track("admission_completed", { eventId, scenario, outcome: "admitted" });
        return;
      }

      setGateway(decision);
      track("admission_queued", { eventId, peopleAhead: decision.peopleAhead });
    } catch {
      setGateway({
        status: "degraded",
        message: "The network is unavailable. Nothing was submitted twice; retry when you are ready.",
      });
      track("admission_completed", { eventId, scenario, outcome: "degraded" });
    }
  };

  const chooseScenario = (nextScenario: AdmissionScenario) => {
    requestId.current = "";
    setScenario(nextScenario);
    setGateway({ status: "idle" });
  };

  return (
    <section className="gateway" aria-labelledby="gateway-title">
      <div className="gateway__intro">
        <span className="event-kicker">REPRODUCIBLE TRAFFIC LAB</span>
        <h2 id="gateway-title">Try the moment demand changes.</h2>
        <p>
          This demo does not claim real audience scale. It exposes the same client contract under
          healthy capacity, a sudden surge, and an upstream failure.
        </p>
      </div>

      <div className="gateway__console">
        <div className="scenario-tabs" role="group" aria-label="Admission scenario">
          {scenarioOptions.map((option) => (
            <button
              type="button"
              className={scenario === option.id ? "scenario-tab scenario-tab--active" : "scenario-tab"}
              aria-pressed={scenario === option.id}
              onClick={() => chooseScenario(option.id)}
              key={option.id}
            >
              <strong>{option.label}</strong>
              <span>{option.description}</span>
            </button>
          ))}
        </div>

        <div className={`gateway-state gateway-state--${gateway.status}`} aria-live="polite">
          {gateway.status === "idle" && (
            <>
              <span className="gateway-state__code">READY / {scenario.toUpperCase()}</span>
              <h3>Request an event pass</h3>
              <p>The public event shell stays available while only personalized entry is gated.</p>
              <button className="gateway-button" type="button" onClick={runScenario}>
                Run entry scenario
              </button>
            </>
          )}

          {gateway.status === "checking" && (
            <>
              <span className="gateway-spinner" aria-hidden="true" />
              <h3>Checking capacity…</h3>
              <p>Your idempotency key protects this request from duplicate admission.</p>
            </>
          )}

          {gateway.status === "queued" && (
            <>
              <span className="gateway-state__code">QUEUE ACTIVE</span>
              <h3>You are in line</h3>
              <strong className="queue-position">{gateway.peopleAhead.toLocaleString()}</strong>
              <p>people ahead · your place refreshes without resubmitting the entry request</p>
              <span className="queue-progress" aria-hidden="true"><i /></span>
            </>
          )}

          {gateway.status === "admitted" && (
            <>
              <span className="gateway-state__code">ADMITTED</span>
              <h3>You’re in.</h3>
              <p>Your pass is confirmed. Timed drops can now load as independent features.</p>
              <code>{gateway.passId}</code>
            </>
          )}

          {gateway.status === "degraded" && (
            <>
              <span className="gateway-state__code">SAFE DEGRADED MODE</span>
              <h3>The event page is still here.</h3>
              <p>{gateway.message}</p>
              <button className="gateway-button gateway-button--light" type="button" onClick={runScenario}>
                Retry safely
              </button>
            </>
          )}
        </div>

        <p className="gateway__disclaimer">
          Contract simulation only · no production queue or real audience count
        </p>
      </div>
    </section>
  );
}
