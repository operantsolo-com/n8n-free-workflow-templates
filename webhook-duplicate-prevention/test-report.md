# Webhook replay lab — observed results

Tested 13 October 2026 in the new sajjadd n8n Cloud workspace.

- Synthetic policy checks: 15 passed, 0 failed.
- Live sequential HTTP checks: 16 passed, 0 failed.
- Run: run-1791882517267
- The receiver was unpublished after testing.

| Case | HTTP status | Decision | Mock actions | Pass |
| --- | --- | --- | --- | --- |
| valid | 200 | applied | 1 | true |
| duplicate | 200 | duplicate | 1 | true |
| newer | 200 | applied | 2 | true |
| older arrives last | 200 | stale | 2 | true |
| missing ID | 400 | reject | 2 | true |
| 429 first attempt | 429 | retry | 2 | true |
| 429 next attempt | 200 | applied | 3 | true |
| 503 first attempt | 503 | retry | 3 | true |
| 503 next attempt | 200 | applied | 4 | true |
| ambiguous mock write | 202 | review | 5 | true |
| ambiguous retry | 202 | review | 5 | true |
| reconcile mock write | 200 | reconciled | 5 | true |
| manual replay | 200 | duplicate | 5 | true |
| ID reused for changed payload | 409 | conflict | 5 | true |
| malformed version | 400 | reject | 5 | true |
| retry budget exhausted | 422 | stop | 5 | true |

## Limits

The action is a fictional counter. 429 and 503 failures are scripted but returned as real HTTP responses with Retry-After: 1. The sender scripts subsequent attempts; it does not implement automatic backoff. The ambiguous-write case models uncertainty with HTTP 202, not a real timeout. Simultaneous requests, atomic event claiming, crash recovery and real external side effects remain untested. Static workflow data is an experimental sequential baseline, not a production event ledger.

For the article, use these results as a reproducible learning lab and clearly explain why production duplicate prevention needs a durable atomic claim and downstream idempotency.
