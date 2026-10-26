function text(value) {
  if (value == null) return '';
  if (typeof value === 'object' && !Array.isArray(value)) {
    return String(value._ ?? '').trim();
  }
  return String(value).trim();
}
return $input.all().map((item, inputIndex) => {
  if (!Object.prototype.hasOwnProperty.call(item.json, 'catalog')) {
    throw new Error('Expected a catalog root; check the XML options and feed schema.');
  }
  const catalog = item.json.catalog === '' ? {} : item.json.catalog;
  if (!catalog || typeof catalog !== 'object' || Array.isArray(catalog)) {
    throw new Error('Unexpected catalog shape.');
  }
  const raw = catalog.product;
  const rows = raw == null ? [] : Array.isArray(raw) ? raw : [raw];
  const products = rows.map((row, productIndex) => {
    if (!row || typeof row !== 'object' || Array.isArray(row)) {
      throw new Error('Expected a product object at position ' + productIndex);
    }
    const sku = text(row.$?.sku);
    const name = text(row.name);
    const priceText = text(row.price);
    const validPrice = /^\d+(?:\.\d{1,2})?$/.test(priceText);
    const errors = [];
    if (!sku) errors.push('missing_sku');
    if (!name) errors.push('missing_name');
    if (!validPrice) errors.push(priceText ? 'invalid_price' : 'missing_price');
    return {sku, name, priceText, price: validPrice ? Number(priceText) : null,
      status: errors.length ? 'review' : 'ready', errors};
  });
  return {json: {products, productCount: products.length,
    reviewCount: products.filter(p => p.status === 'review').length},
    pairedItem: {item: inputIndex}};
});