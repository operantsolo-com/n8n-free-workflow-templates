// HTML to PDF with no external service. Paste your HTML into item.json.html.
// OperantSolo: simple HTML to PDF for the n8n Code node (no modules, no external service).
// Supports: h1-h3, p, ul/ol/li, br, pre. Ignores CSS, images, tables and inline bold.
function htmlToPdf(html, opts) {
  opts = opts || {};
  const W = [
    [278,278,355,556,556,889,667,191,333,333,389,584,278,333,278,278,556,556,556,556,556,556,556,556,556,556,278,278,584,584,584,556,1015,667,667,722,722,667,611,778,722,278,500,667,556,833,722,778,667,778,722,667,611,722,667,944,667,667,611,278,278,278,469,556,333,556,556,500,556,556,278,556,556,222,222,500,222,833,556,556,556,556,333,500,278,556,500,722,500,500,500,334,260,334,584],
    [278,333,474,556,556,889,722,238,333,333,389,584,278,333,278,278,556,556,556,556,556,556,556,556,556,556,333,333,584,584,584,611,975,722,722,722,722,667,611,778,722,278,556,722,611,833,722,778,667,778,722,667,611,722,667,944,667,667,611,333,278,333,584,556,333,556,611,556,611,556,333,611,611,278,278,556,278,889,611,611,611,611,389,556,333,611,556,778,556,556,500,389,280,389,584]
  ];
  const CP = { 8226: 149, 8211: 150, 8212: 151, 8216: 145, 8217: 146, 8220: 147, 8221: 148, 8230: 133, 8364: 128, 8482: 153 };
  const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', mdash: '\u2014', ndash: '\u2013', hellip: '\u2026', rsquo: '\u2019', lsquo: '\u2018', ldquo: '\u201c', rdquo: '\u201d', bull: '\u2022', copy: '\u00a9', reg: '\u00ae', euro: '\u20ac', trade: '\u2122', middot: '\u00b7', eacute: '\u00e9', egrave: '\u00e8', agrave: '\u00e0', aacute: '\u00e1', iacute: '\u00ed', oacute: '\u00f3', uacute: '\u00fa', ntilde: '\u00f1', uuml: '\u00fc', ouml: '\u00f6', auml: '\u00e4', ccedil: '\u00e7', pound: '\u00a3', laquo: '\u00ab', raquo: '\u00bb' };
  const decode = (s) => s.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (m, e) => {
    if (e[0] === '#') { const n = e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10); return String.fromCodePoint(n || 63); }
    return ENT[e.toLowerCase()] !== undefined ? ENT[e.toLowerCase()] : m;
  });
  const code = (ch) => { const c = ch.codePointAt(0); if (c >= 32 && c < 127) return c; if (CP[c]) return CP[c]; if (c >= 160 && c <= 255) return c; return 63; };
  const width = (s, bold, size) => { let w = 0; for (const ch of s) { const c = code(ch); w += c >= 32 && c < 127 ? W[bold ? 1 : 0][c - 32] : 556; } return w * size / 1000; };

  // 1. HTML to blocks
  let h = String(html || '').replace(/<(script|style|head)[\s\S]*?<\/\1>/gi, '').replace(/<!--[\s\S]*?-->/g, '');
  const blocks = [];
  const re = /<(h[1-3]|p|li|pre|div|tr)\b[^>]*>([\s\S]*?)<\/\1>|<(hr)\b[^>]*>/gi;
  let m, any = false;
  const ol = []; // not tracking nesting; numbering for <ol> handled below
  const olRanges = []; { const r2 = /<ol\b[^>]*>([\s\S]*?)<\/ol>/gi; let o; while ((o = r2.exec(h))) olRanges.push([o.index, o.index + o[0].length]); }
  let olCount = 0, lastOl = -1;
  while ((m = re.exec(h))) {
    any = true;
    const tag = (m[1] || m[3]).toLowerCase();
    if (tag === 'hr') { blocks.push({ t: 'hr' }); continue; }
    let inner = m[2];
    const pre = tag === 'pre';
    inner = inner.replace(/<br\s*\/?>/gi, '\n').replace(/<\/?(ul|ol)\b[^>]*>/gi, '');
    inner = inner.replace(/<[^>]+>/g, '');
    inner = decode(inner);
    if (!pre) inner = inner.replace(/[ \t\r\n]+/g, ' ').trim();
    if (!inner) continue;
    if (tag === 'li') {
      const idx = olRanges.findIndex(r => m.index >= r[0] && m.index < r[1]);
      if (idx >= 0) { if (idx !== lastOl) { lastOl = idx; olCount = 0; } olCount++; blocks.push({ t: 'li', text: inner, mark: olCount + '.' }); }
      else blocks.push({ t: 'li', text: inner, mark: '\u2022' });
    } else blocks.push({ t: pre ? 'pre' : tag, text: inner });
  }
  if (!any) { const txt = decode(h.replace(/<[^>]+>/g, ' ')).replace(/[ \t\r\n]+/g, ' ').trim(); if (txt) blocks.push({ t: 'p', text: txt }); }

  // 2. layout
  const PW = 595, PH = 842, M = 56, MAXW = PW - 2 * M;
  const ST = { h1: [22, 1, 28, 14], h2: [16, 1, 21, 10], h3: [13, 1, 17, 8], p: [11, 0, 15, 7], li: [11, 0, 15, 3], pre: [9.5, 0, 12.5, 7], tr: [11, 0, 15, 3], div: [11, 0, 15, 7] };
  const pages = [[]]; let y = PH - M; // y = top of next line
  const esc = (s) => { let o = ''; for (const ch of s) { const c = code(ch); if (c === 40 || c === 41 || c === 92) o += '\\' + String.fromCharCode(c); else if (c < 32 || c > 126) o += '\\' + c.toString(8).padStart(3, '0'); else o += String.fromCharCode(c); } return o; };
  const need = (lh) => { if (y - lh < M) { pages.push([]); y = PH - M; } };
  const put = (x, text, bold, size, lh) => { need(lh); y -= lh; pages[pages.length - 1].push('BT /F' + (bold ? 2 : 1) + ' ' + size + ' Tf ' + x.toFixed(1) + ' ' + (y + (lh - size) * 0.3).toFixed(1) + ' Td (' + esc(text) + ') Tj ET'); };
  const wrap = (text, bold, size, maxw) => {
    const lines = []; let cur = '';
    for (const word of text.split(' ')) {
      let w = word;
      while (width(w, bold, size) > maxw) { // break very long words
        let k = w.length; while (k > 1 && width(w.slice(0, k), bold, size) > maxw) k--;
        if (cur) { lines.push(cur); cur = ''; }
        lines.push(w.slice(0, k)); w = w.slice(k);
      }
      const t = cur ? cur + ' ' + w : w;
      if (width(t, bold, size) <= maxw) cur = t; else { if (cur) lines.push(cur); cur = w; }
    }
    if (cur) lines.push(cur); return lines;
  };
  for (const b of blocks) {
    if (b.t === 'hr') { need(14); y -= 10; pages[pages.length - 1].push('0.7 G ' + M + ' ' + y.toFixed(1) + ' m ' + (PW - M) + ' ' + y.toFixed(1) + ' l S'); y -= 4; continue; }
    const [size, bold, lh, gap] = ST[b.t] || ST.p;
    const indent = b.t === 'li' ? 18 : 0;
    const maxw = MAXW - indent;
    if (b.t === 'pre') { for (const raw of b.text.split('\n')) { const line = raw.replace(/\t/g, '    '); const lead = (line.match(/^ */) || [''])[0].length; const x0 = Math.min(lead, 20) * width(' ', false, size); const ls = wrap(line.trim() || ' ', false, size, maxw - x0); ls.forEach((l, i) => put(M + (i === 0 ? x0 : x0), l, false, size, lh)); } }
    else { const ls = wrap(b.text, !!bold, size, maxw); ls.forEach((l, i) => { if (i === 0 && b.t === 'li') { need(lh); put(M + 2, b.mark, false, size, lh); y += lh; } put(M + indent, l, !!bold, size, lh); }); }
    y -= gap;
  }

  // 3. PDF assembly (ASCII/latin1 only)
  const objs = []; // index = object number - 1
  const nPages = pages.length;
  objs[0] = '<< /Type /Catalog /Pages 2 0 R >>';
  const kids = []; for (let i = 0; i < nPages; i++) kids.push((5 + i * 2) + ' 0 R');
  objs[1] = '<< /Type /Pages /Kids [' + kids.join(' ') + '] /Count ' + nPages + ' >>';
  objs[2] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>';
  objs[3] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>';
  pages.forEach((ops, i) => {
    const stream = ops.join('\n');
    objs[4 + i * 2] = '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ' + PW + ' ' + PH + '] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ' + (6 + i * 2) + ' 0 R >>';
    objs[5 + i * 2] = '<< /Length ' + stream.length + ' >>\nstream\n' + stream + '\nendstream';
  });
  let infoNo = objs.length + 1;
  objs.push('<< /Title (' + esc(String(opts.title || 'Document').slice(0, 120)) + ') /Producer (OperantSolo n8n Code node) >>');
  let out = '%PDF-1.4\n'; const offs = [];
  objs.forEach((o, i) => { offs.push(out.length); out += (i + 1) + ' 0 obj\n' + o + '\nendobj\n'; });
  const xref = out.length;
  out += 'xref\n0 ' + (objs.length + 1) + '\n0000000000 65535 f \n' + offs.map(o => String(o).padStart(10, '0') + ' 00000 n \n').join('');
  out += 'trailer\n<< /Size ' + (objs.length + 1) + ' /Root 1 0 R /Info ' + infoNo + ' 0 R >>\nstartxref\n' + xref + '\n%%EOF\n';
  return { buffer: Buffer.from(out, 'latin1'), pages: nPages, blocks: blocks.length };
}

const out = [];
for (const item of $input.all()) {
  const filename = item.json.filename || 'document.pdf';
  const r = htmlToPdf(item.json.html, { title: filename });
  const bin = await this.helpers.prepareBinaryData(r.buffer, filename, 'application/pdf');
  out.push({ json: { filename, pages: r.pages, bytes: r.buffer.length }, binary: { data: bin } });
}
return out;