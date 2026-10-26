# OperantSolo: 50 n8n expressions lab

Original examples, sample input and expected results by OperantSolo.

Tested on 8 October 2026 in an n8n Cloud workspace. One manual execution evaluated all 50 expressions in Edit Fields and compared their outputs with the expected values: 50 passed, 0 failed.

Import n8n-50-expressions-lab.json into a new workflow. It uses a Manual Trigger, two Code nodes and an Edit Fields node. No credentials, external API calls or live customer data are required. Run manually and inspect Check expected results.

The Edit Fields node wraps each expression with JSON.stringify so the checker can compare consistent values. For normal workflow fields, use the expression itself, between {{ and }}. Match the output field type to the result.

This is a fixed-fixture learning lab. It does not establish that every expression handles every possible input. Dates use UTC except the explicit Asia/Kolkata conversion. Text month output follows the instance locale; the recorded run used English. Check input types, missing values, timezone and item linking before adapting this to production.

Reference: https://operantsolo.com/n8n-expressions/

## License

MIT License. Copyright (c) 2026 OperantSolo.

Permission is hereby granted, free of charge, to any person obtaining a copy of these examples and associated documentation files (the Software), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED AS IS, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
