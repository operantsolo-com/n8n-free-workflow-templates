// OperantSolo Retry-After policy lab, 7 October 2026. MIT licensed.
// A decision function: it does not send requests or sleep.
function retryPolicy(job, nowMs = Date.now(), random = Math.random) {
  const response = job.response || {};
  const status = Number(response.statusCode);
  const attempt = Number(job.attempt);
  const maxAttempts = Number(job.maxAttempts ?? 4);
  const baseSeconds = Number(job.baseSeconds ?? 2);
  const maxInlineSeconds = Number(job.maxInlineSeconds ?? 300);
  if (!Number.isInteger(attempt) || attempt < 1 ||
      !Number.isInteger(maxAttempts) || maxAttempts < 1 ||
      !Number.isFinite(baseSeconds) || baseSeconds < 1 ||
      !Number.isFinite(maxInlineSeconds) || maxInlineSeconds < 1 ||
      !Number.isFinite(nowMs)) throw new Error('Invalid retry configuration');
  const result = (decision, reason, waitSeconds = 0, extra = {}) => ({
    ...job, decision, reason, waitSeconds, ...extra,
  });
  if (status >= 200 && status < 300) return result('success', 'http_success');
  if (status !== 429) return result('stop', 'not_a_429');
  if (job.safeToRetry !== true) return result('review', 'repeat_not_confirmed_safe');
  if (attempt >= maxAttempts) return result('stop', 'attempt_budget_exhausted');
  const headers = Object.fromEntries(Object.entries(response.headers || {})
    .map(([key, value]) => [key.toLowerCase(), value]));
  const raw = headers['retry-after'];
  let providerSeconds = null;
  let source = 'fallback_backoff';
  if (typeof raw === 'string' || typeof raw === 'number') {
    const value = String(raw).trim();
    if (/^\d+$/.test(value)) {
      providerSeconds = Number(value);
      source = 'retry_after_seconds';
    } else if (/^(?:[A-Za-z]{3},\s*\d{1,2}\s+[A-Za-z]{3}\s+\d{4}|[A-Za-z]+,\s*\d{2}-[A-Za-z]{3}-\d{2}|[A-Za-z]{3}\s+[A-Za-z]{3}\s+\d{1,2}\s)/.test(value)) {
      const retryAt = Date.parse(value);
      if (Number.isFinite(retryAt)) {
        // Using the response Date as well is conservative when clocks differ.
        const serverNow = Date.parse(String(headers.date || ''));
        const reference = Number.isFinite(serverNow) ? Math.min(nowMs, serverNow) : nowMs;
        providerSeconds = Math.max(0, Math.ceil((retryAt - reference) / 1000));
        source = 'retry_after_http_date';
      }
    }
  }
  if (!Number.isFinite(providerSeconds)) providerSeconds = null;
  const fallback = Math.min(60, baseSeconds * 2 ** Math.min(attempt - 1, 20));
  const minimumSeconds = Math.max(1, Math.ceil(providerSeconds ?? fallback));
  const jitterSeconds = Math.min(1, Math.max(0, Number(random()) || 0));
  // Add jitter AFTER the provider floor; never multiply that floor down.
  const waitSeconds = Math.ceil(minimumSeconds + jitterSeconds);
  const notBefore = new Date(nowMs + waitSeconds * 1000).toISOString();
  const extra = { minimumSeconds, source, notBefore, nextAttempt: attempt + 1 };
  if (waitSeconds > maxInlineSeconds) return result('defer', 'wait_exceeds_inline_budget', waitSeconds, extra);
  return result('retry', 'within_budget', waitSeconds, extra);
}
module.exports = { retryPolicy };
