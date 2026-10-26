const seen = new Set();
return $input.all().map((item, index) => {
  const raw = item.json.email;
  const email = typeof raw === 'string' ? raw.trim().toLowerCase() : '';
  let status = 'ready';
  let reason = 'first_valid_email_in_batch';
  if (!email) { status = 'review'; reason = 'missing_email'; }
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    status = 'review'; reason = 'invalid_email_format';
  } else if (seen.has(email)) { status = 'duplicate'; reason = 'email_already_in_batch'; }
  else { seen.add(email); }
  return { json: {...item.json, original_email: raw ?? null, email, status, reason}, pairedItem: {item:index} };
});