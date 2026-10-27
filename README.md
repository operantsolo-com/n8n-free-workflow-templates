# n8n Free Workflow Templates (Tested, Importable JSON)

Free n8n workflow downloads you can import in one click. Every workflow here was run by hand before it was published. Each folder says what was tested, what was not, and links to a step-by-step guide.

- No credentials, no paid APIs, no customer data. Samples use fictional records.
- Each workflow imports into a **new** n8n workflow (More actions > Import from file).
- Original files by [OperantSolo](https://operantsolo.com/), MIT licensed.
- Need only the PDF step? Use the [free HTML to PDF tool for n8n](https://operantsolo.com/n8n-html-to-pdf-tool/): try it in your browser, then copy the Code node.

## Workflows

| Folder | What it does | Tested on | Guide |
|---|---|---|---|
| [`loop-over-items`](loop-over-items) | Loop Over Items with a checker that proves every record was processed. Includes empty-output and wrong-first-item cases. | n8n Cloud, 17 Oct 2026 | [Guide](https://operantsolo.com/n8n-loop-over-items/?utm_source=github&utm_medium=repo) |
| [`binary-data`](binary-data) | Build a small file in a workflow and check that the binary data reaches the next node. | n8n Cloud, 17 Oct 2026 | [Guide](https://operantsolo.com/n8n-binary-data/?utm_source=github&utm_medium=repo) |
| [`sub-workflow-return`](sub-workflow-return) | Call a sub-workflow and check what it returns, including the zero-items case. | n8n Cloud, 17 Oct 2026 | [Guide](https://operantsolo.com/n8n-sub-workflow-return/?utm_source=github&utm_medium=repo) |
| [`expressions-50`](expressions-50) | 50 expression examples, all checked against expected values in one run (50 passed, 0 failed). | n8n Cloud, 8 Oct 2026 | [Guide](https://operantsolo.com/n8n-expressions/?utm_source=github&utm_medium=repo) |
| [`xml-to-json`](xml-to-json) | Convert an XML product catalog to clean JSON items with review flags. 8 test cases passed. | n8n Cloud 2.43.2, 9 Oct 2026 | [Guide](https://operantsolo.com/n8n-xml-to-json/?utm_source=github&utm_medium=repo) |
| [`retry-after-429`](retry-after-429) | Handle HTTP 429 using the Retry-After header. 18 policy checks passed, plus a loop demo with a real Wait. | n8n Cloud 2.43.0, 7 Oct 2026 | [Guide](https://operantsolo.com/n8n-rate-limit-retry-after/?utm_source=github&utm_medium=repo) |
| [`webhook-duplicate-prevention`](webhook-duplicate-prevention) | Webhook receiver and replay sender for testing duplicate deliveries. Baseline only, not production-safe. | see `test-report.md` | [Guide](https://operantsolo.com/n8n-webhook-duplicate-prevention/?utm_source=github&utm_medium=repo) |
| [`lead-email-cleanup`](lead-email-cleanup) | Clean and flag lead emails: lowercase, trim, format check, duplicate flag. Demo: 5 in, 2 ready, 1 duplicate, 2 to review. | see folder README | [Guide](https://operantsolo.com/n8n-lead-email-cleanup/?utm_source=github&utm_medium=repo) |
| [`html-to-pdf`](html-to-pdf) | Turn simple HTML into a PDF inside a Code node, with no external service. Reads the PDF back and checks the text. | n8n Cloud, 26 Oct 2026 | [Try it in your browser](https://operantsolo.com/n8n-html-to-pdf-tool/) |

More downloads and guides: https://operantsolo.com/free-n8n-workflows/

## How to import

1. In n8n, create a **new, blank** workflow.
2. Open the menu (three dots), choose **Import from file**, and pick the `.json` file from the folder.
3. Run it manually and open the checker node named in that folder's README.

Importing onto an existing canvas can append nodes, so use a new workflow.

## Honest limits

These are learning labs and starting points. They test fixed, fictional inputs. They do not prove production safety, concurrency safety or real API behavior unless a folder says so. Read each folder's README before you adapt a workflow to live data.

## Contributing

Found a case that breaks a workflow? Open an issue with your n8n version, the input and what you expected. Fixes with a short test note are welcome.

## Keywords

n8n workflow, free n8n workflow, free n8n workflow download, n8n templates, n8n workflow JSON, n8n loop over items, n8n webhook, n8n binary data, n8n expressions, n8n retry 429.
