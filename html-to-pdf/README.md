# n8n HTML to PDF with no external service

A small n8n workflow that turns simple HTML into a PDF file inside a Code node. No community node, no npm module, no API key and no paid PDF service, so it works on n8n Cloud.

It is made for the common case: you have an email body, a report or an invoice written as simple HTML and you need a PDF file you can attach, save or upload.

## What is in this folder

- `operantsolo-html-to-pdf.json`: import this into a NEW workflow. It has five nodes: Manual Trigger, Sample HTML, HTML to PDF, Read PDF text back, Check results.
- `html-to-pdf-code-node.js`: the same Code node code on its own, to paste into your own workflow.

## How to use it

1. Import the JSON into a new, blank workflow and click Execute workflow.
2. Open `Check results`. Expect `passed: true`. Each sample PDF is read back with the Extract From File node and checked for the text it should contain.
3. To use it for real, replace `Sample HTML` with your own data. Each item needs `json.html` (your HTML) and optionally `json.filename`. The PDF comes out as binary property `data`.

## What it supports

Headings (h1 to h3), paragraphs, bullet and numbered lists, line breaks, preformatted text, horizontal rules, common HTML entities and A4 pages with automatic page breaks and word wrap. Text uses the built-in Helvetica font.

## What it does not do

No CSS, no images, no tables, no links you can click, no inline bold or italic, no right-to-left or non-Latin scripts (they print as ?), and no exact copy of how a web page looks in a browser. For a pixel-perfect page, use a browser-based PDF service or the HTML to PDF route that fits your setup. Preformatted text uses the same font, not a code font.

## How it was checked

Local checks: the generated PDFs passed qpdf (no syntax errors), pdftotext read the expected text back, and a rendered page image looked right.

n8n Cloud check, 26 October 2026 (manual run, n8n version not recorded): the workflow ran in about 2.4 seconds. Check results returned `passed: true` for both samples. `invoice-1001.pdf` came out as 1 page (1,411 bytes) and `long-report.pdf` as 3 pages (9,339 bytes). The Extract From File node read the text back from both PDFs and every expected phrase was found.

Not tested: very large inputs, non-Latin text, emoji, HTML copied from real email clients, and opening the files in every PDF viewer. Test with your own HTML before relying on it.

MIT license (see the repository root). n8n has its own terms.
