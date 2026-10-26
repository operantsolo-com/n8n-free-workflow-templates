# Observed n8n Cloud checks

Date: 17 October 2026. Environment: n8n Cloud 2.44.3, JavaScript Code nodes typeVersion 2, Loop Over Items typeVersion 3, Reset off. Runs were started manually in one isolated learning workflow. No credentials, customer data, HTTP calls, paid APIs or published triggers were involved.

These are observations of four small cases, not a performance benchmark or a production reliability test. Summaries were read from the n8n editor's visible outputs and saved as JSON. They are not raw server execution exports.

| Case | Change | Observed result |
| --- | --- | --- |
| Five records, Batch Size 1 | Baseline | Five processing runs, six loop-node runs, all five unique IDs returned, checker passed |
| Five records, Batch Size 2 | Change Batch Size only | Processing run options showed 2, 2 and 1 output items; four loop-node runs; checker passed |
| Empty second batch | With Batch Size 2, return an empty list when the batch starts with R003 | Processing and loop nodes ran twice; processing panel reported no output data; the final checker did not run |
| Repeated first record | With Batch Size 2, use the first source record for every output | Five returned rows were all R001; checker reported passed false, missing R002-R005 and duplicate R001 |

After the failure checks, the original processor and Batch Size 1 were restored. A further manual run passed. Its summary is included as `cloud-restored-baseline.json`.

The negative cases behaved as intended: the completeness check caught repeated records, and no passing summary was invented when the processing path returned no data.

The fixture contains five unique non-empty string IDs. The checker assumes one returned record for each input ID and checks the synthetic `processed` flag. It does not verify any business action or external delivery. For a workflow that intentionally filters, splits or combines records, change the expected results.

Not tested here: zero-record scheduling, Reset polling, concurrent runs, retries, API limits, memory capacity, persistence across restarts or real business actions. The article's advice on those topics is documentation-led and should not be represented as a new observed test.
