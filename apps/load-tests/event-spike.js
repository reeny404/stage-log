import http from "k6/http";
import { check, sleep } from "k6";

const baseUrl = __ENV.BASE_URL || "http://localhost:3000";

export const options = {
  scenarios: {
    cached_event_reads: {
      executor: "ramping-arrival-rate",
      startRate: 5,
      timeUnit: "1s",
      preAllocatedVUs: 30,
      maxVUs: 120,
      stages: [
        { target: 25, duration: "10s" },
        { target: 100, duration: "20s" },
        { target: 10, duration: "10s" },
      ],
      exec: "readEvent",
    },
    admission_spike: {
      executor: "ramping-arrival-rate",
      startTime: "5s",
      startRate: 2,
      timeUnit: "1s",
      preAllocatedVUs: 30,
      maxVUs: 120,
      stages: [
        { target: 60, duration: "10s" },
        { target: 60, duration: "15s" },
        { target: 5, duration: "10s" },
      ],
      exec: "requestAdmission",
    },
  },
  thresholds: {
    http_req_failed: ["rate<0.01"],
    "http_req_duration{flow:event-shell}": ["p(95)<500"],
    "http_req_duration{flow:admission}": ["p(95)<800"],
  },
};

export function readEvent() {
  const response = http.get(`${baseUrl}/event/global-stage-drop`, {
    tags: { flow: "event-shell" },
  });
  check(response, { "event shell is available": (result) => result.status === 200 });
  sleep(0.2);
}

export function requestAdmission() {
  const requestId = `load-${__VU}-${__ITER}`;
  const response = http.post(
    `${baseUrl}/api/demo/admission`,
    JSON.stringify({ eventId: "event-stage-wave-2026", scenario: "surge" }),
    {
      tags: { flow: "admission" },
      headers: {
        "Content-Type": "application/json",
        "x-idempotency-key": requestId,
      },
    },
  );
  check(response, { "request is queued": (result) => result.status === 200 });
  sleep(0.2);
}
