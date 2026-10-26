# OperantSolo XML to JSON lab

Article: https://operantsolo.com/n8n-xml-to-json/

Tested manually in n8n Cloud 2.43.2 on 9 October 2026. The Assert 8 cases node reported cases=8, passed=8. Split products / Preview only emitted 8 product items, including 2 review rows. Evidence: n8n-xml-test-results.png and n8n-results-visible.txt.

## Run
1. Extract this ZIP.
2. Create a new n8n workflow. Use More actions → Import → From file.
3. Select n8n-xml-to-json-lab.json.
4. Click Execute workflow. Open Assert 8 cases: expect passed=8 and cases=8.
5. Open Preview only to inspect products. There are no external requests or writes.

## Scope
The lab expects a catalog root with zero, one or many product children. SKU comes from the sku attribute. Name and price are scalar child text; text with an attribute uses _. Explicit Array is off; Merge Attributes is off; Explicit Root is on. Prices must be non-negative decimal strings with at most two decimal places. Zero is valid; missing/invalid prices remain null with a review status. SKU stays a string.

This is an educational fixture lab, not a full feed importer, XML schema validator, streaming parser or currency accounting engine. It does not handle arbitrary namespaces or repeated name/price elements. Adapt and validate those schemas separately. No real API, database, Sheets or CRM integration, malformed XML test or large-file load test is claimed.

Before writes, route product.status=ready separately from review rows. Use your destination's unique SKU/upsert rules and decide what missing or empty feeds mean. Never treat an empty feed as permission to delete existing records.

Fixture and test-assertion branches are for this lab. Replace XML fixtures with your HTTP Request/Extract from File source in a copy, and remove Assert 8 cases. Keep Parse XML → Normalize catalog → Split products. Filter ready rows before adding any destination.

Files: importable JSON, synthetic fixtures.json, readable normalize-catalog.js and this README. No credentials, account IDs or personal data are included.
