# StageLog load scenarios

This folder contains a reproducible lab workload, not evidence of production audience scale.

With the web app running locally and [k6](https://grafana.com/docs/k6/latest/set-up/install-k6/) installed:

```bash
k6 run apps/load-tests/event-spike.js
```

To exercise an isolated deployment:

```bash
k6 run -e BASE_URL=https://your-test-host.example apps/load-tests/event-spike.js
```

The default workload separates cache-friendly event reads from personalized admission writes. Record the host, commit, date, machine or plan, and unmodified k6 summary whenever publishing results.
