# OperantSolo sub-workflow return learning lab

Import operantsolo-sub-workflow-return-lab.json into a NEW n8n workflow. Run manually. No credentials, external calls, customer records, automatic trigger or publishing needed.

The parent embeds the two-node child JSON in Call return child, Source Define Below. This avoids hard-coded account workflow IDs. return-contract-child.json is also included for readers who want to import a separate saved child; then choose that saved workflow in the parent's Database source. The reported tests use the embedded source only.

Baseline: caller Mode Run once with all items; Wait For Sub-Workflow Completion on. Expected checker output: passed true, two returned IDs SUB001/SUB002, normalized emails ada@example.test/ben@example.test, child_batch_sizes [2,2].

Comparisons to try in a COPY:
1. Mode Run once for each item, wait on. Expect both results, child_batch_sizes [1,1].
2. Mode all items, wait off. The parent passes original inputs onward; checker should return passed false because child result fields are absent. Child still runs; do not use this variant for live external actions.
3. Restore wait on. In the embedded child JSON, change the final Code node jsCode to return []; and run. Expect no call output and no execution of the following checker. This is zero items, not an empty JSON object.
4. Restore original embedded child JSON from the unmodified lab file and rerun baseline.

The checker returns diagnostic JSON, even for passed false. Add an explicit branch or error gate before production side effects. This fixture's email transform is a marker of child execution, not an email validation service.

Boundaries: two fictional JSON records; no Wait node, paused execution, AI agent, external side effect, retries or performance benchmark. Use individual input validation and a clear no-results contract when adapting.

The original workflow, checker and fixture are MIT licensed. n8n and linked documentation retain their own terms.
