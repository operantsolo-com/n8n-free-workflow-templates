# OperantSolo Loop Over Items learning lab

This is a small, original learning example for https://operantsolo.com/. It uses fictional records, makes no network requests and contains no credentials.

## Run the example

1. Create a new n8n workflow.
2. Import `operantsolo-loop-over-items.json`. The file has no workflow ID, so it is intended as a new example rather than an update to an existing workflow.
3. Keep the node names unchanged for the first run. The checker refers to `Sample records` by name.
4. Run the complete workflow from Manual Trigger.
5. Open `Check record IDs`. For the baseline, expect five unique IDs, `processed: true` on the returned records and `passed: true` in the summary.
6. Change Batch Size from 1 to 2 and rerun. The expected processing batch sizes are 2, 2 and 1.

The checker assumes a non-empty string ID for each record, unique input IDs, and one returned record per source record. Change its rules if your own workflow deliberately filters, combines or splits records. A missing checker run is not a successful completeness check.

## What is included

- `operantsolo-loop-over-items.json`: the baseline workflow.
- `fixture.json`: the five fictional records.
- `LICENSE`: permission to reuse the original lab files.
- `cloud-*.json`: observed summaries from the manual n8n Cloud checks.
- `TEST-NOTES.md`: the environment, changes and limits of those checks.

Do not use this sample as an order processor, a job queue, a delivery guarantee or proof of concurrency safety. It does not test a real API, pricing plan, provider quota, retries, crash recovery or restart durability.

## Technical basis

The export uses Loop Over Items typeVersion 3 and JavaScript Code nodes typeVersion 2. Done is output 0 and Loop is output 1 in the version-3 connection array. The processing output returns to the loop input. Reset is disabled.

Official references:
- https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.splitinbatches/
- https://docs.n8n.io/flow-logic/looping/
- https://docs.n8n.io/data/data-mapping/data-item-linking/item-linking-code-node/

The MIT license here covers OperantSolo's original lab files, not n8n's software or documentation.
