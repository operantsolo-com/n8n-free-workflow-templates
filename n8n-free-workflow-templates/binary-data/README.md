# OperantSolo binary-data learning lab

Import operantsolo-binary-data-lab.json into a NEW workflow. Run manually. It has five core nodes, no credentials, no network requests and no automatic trigger. It creates a fictional 53-byte text file under binary.report and compares the decoded content with the fixture.

Expected baseline: passed true, binary_keys [report], file_name operantsolo-report.txt, mime_type text/plain, byte_length 53. Fixture uses LF line endings and ends with a newline.

To reproduce the negative cases in a copy:
1. In Keep file while editing JSON, remove the binary property from each returned item. Execute the whole workflow. Checker returns passed false, reason missing_binary_key, no binary keys.
2. Restore binary, but rename report to attachment. Keep checker key report. Execute. Checker returns passed false and binary_keys [attachment].
3. Change checker key to attachment. Execute. The same 53 bytes should pass.
4. Restore the original transform and report checker before adapting the workflow.

The checker deliberately returns diagnostic JSON, including passed false. n8n can show a successful execution for a failed file check. To use a check as a production gate, add routing or throw an error according to your workflow's requirements.

Scope: one small text fixture, manual Cloud execution. This does not test live HTTP uploads, PDF parsing, file scanning, large-file capacity, restart recovery or a destination API's requirements. The full checker passes binary data forward; the shortened JSON-summary snippet in the article does not.

Original code and fixture: MIT license. n8n and its documentation retain their own terms.
