# OperantSolo Retry-After lab

Built and checked October 7, 2026. These are educational, offline n8n workflows.
Responses are simulated. No credentials, API tokens, customer data or outbound
API requests are included. Tested in n8n Cloud 2.43.0.

## Import
Unzip. Create TWO separate blank workflows. For each, use Import > From file.
Importing onto an existing canvas may append nodes. Manual Trigger only.

1. n8n-retry-after-policy-tests.json: Execute, inspect Assert 18 results.
Expected PASS, 18 passed, 0 failed. Fixed clock and jitter; no real waits.
2. n8n-retry-after-loop-demo.json: Execute, inspect Check loop outcome.
Expected PASS, attempts 2, statuses 429 then 200, observed gap >= 2 seconds,
and original job ID offline-demo-001. Real Wait; simulated HTTP-shaped output.
The Request context / Attach response pair restores linked input each iteration.

## Policy
Four TOTAL attempts including first. Only 429 is retryable by this policy.
safeToRetry must explicitly be true; this flag does not create idempotency.
Retry-After: non-negative integer seconds or HTTP date. Date handling uses
earlier local clock/valid server Date. Missing/invalid: base 2-second exponential
fallback capped at 60 seconds. Valid provider wait is never capped down.
Minimum pause 1 second. Additive 0..1-second jitter, rounded up. Waits over
maxInlineSeconds (default 300) return defer, not early retry.

## Real API adaptation (NOT live API tested)
Replace Simulate 429 then 200 with HTTP Request. Enable Include Response Headers
and Status + Never Error. Inspect output statusCode / headers / body, and retain
Request context / Attach response. Keep item linking intact. Validate using one
safe read job first. Transport errors need another path. Keep native Retry On
Fail off when the custom loop owns retries, to avoid multiplying attempts.
Replace final assertion with distinct success / stop / review / defer branches.
Persist deferred jobs and notBefore in durable storage with a later dispatcher;
no dispatcher is included. A shared provider quota needs shared coordination.
Never assume this single-job demo protects concurrent executions or write APIs.

## Files
retry-policy.js: reusable decision function.
n8n-policy-code.txt: Code node version.
fixtures.json, test-results.json, test-results.csv: full deterministic cases.
Policy unit checks: 18 fixtures plus 28 provider-floor jitter combinations.
Not a provider load test, performance benchmark or guarantee of production safety.

## License
Original code and fixtures: MIT (see LICENSE.txt).
Third-party product names belong to their owners. No affiliation implied.
