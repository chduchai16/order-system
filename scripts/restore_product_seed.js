const fs = require('fs');

const path = 'D:/Java/order-system/init-databases.sql';
const sql = fs.readFileSync(path, 'utf8');
const start = sql.indexOf('INSERT INTO products (sku, name, category_id, description, price, stock, reserved_stock, version, active, created_at, updated_at) VALUES');
if (start < 0) throw new Error('products seed not found');
const end = sql.indexOf('-- Keep seed light; variants/attributes/stock movements can be added later when needed.');
const block = sql.slice(start, end);
const rows = block
  .split('\n')
  .map((line) => line.trim())
  .filter((line) => line.startsWith('(') && (line.endsWith('),') || line.endsWith(');')))
  .map((line) => line.slice(1, line.endsWith('),') ? -2 : -2));

function splitValues(text) {
  const values = [];
  let cur = '';
  let inStr = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (ch === "'") {
      if (inStr && text[i + 1] === "'") {
        cur += "'";
        i += 1;
      } else {
        inStr = !inStr;
      }
      continue;
    }
    if (ch === ',' && !inStr) {
      values.push(cur.trim());
      cur = '';
      continue;
    }
    cur += ch;
  }
  values.push(cur.trim());
  return values;
}

const updates = rows.map((row) => {
  const [sku, _name, categoryId, description, price, stock, reservedStock, _version, active] = splitValues(row);
  const id = Number(sku.split('-')[1]);
  const cat = categoryId === 'NULL' ? 'NULL' : categoryId;
  const desc = description === 'NULL' ? 'NULL' : `'${String(description).replace(/'/g, "''")}'`;
  return `UPDATE products SET category_id=${cat}, description=${desc}, price=${price}, stock=${stock}, reserved_stock=${reservedStock}, active=${active} WHERE id=${id};`;
});

const outPath = 'D:/Java/order-system/.restore_products.sql';
fs.writeFileSync(outPath, updates.join('\n'));
console.log(`wrote ${updates.length} updates to ${outPath}`);
