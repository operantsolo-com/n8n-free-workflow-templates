# OperantSolo webhook replay learning lab

Three workflows: synthetic policy checks, a fictional webhook receiver, and a manual HTTP replay sender.

The receiver uses experimental n8n static data as a sequential baseline. It is not an atomic event ledger and not a production-safe order/payment handler. The action is a counter. HTTP status codes and Retry-After headers are real responses, but failures and ambiguous-write outcomes are scripted mocks. No customer records, paid API calls or credentials are involved.

Import receiver-baseline.json and publish only for testing. Import sender-tests.json, replace its endpoint with your own receiver production URL, and run it. The sender issues 16 requests with a one-second batch interval. Each run uses a fresh run ID. Unpublish the receiver after testing.

A passing result validates only the specified fictional scenarios. It does not establish concurrency safety, restart durability, a real provider idempotency guarantee, or real timeout/crash recovery.
