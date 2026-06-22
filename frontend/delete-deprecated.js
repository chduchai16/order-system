const fs = require('fs');
const path = require('path');

const filesToDelete = [
  'app/(dashboard)/cart/page.tsx',
  'app/(dashboard)/checkout/page.tsx',
  'app/(dashboard)/orders/page.tsx',
  'app/(dashboard)/wishlist/page.tsx',
  'app/(dashboard)/addresses/page.tsx',
  'app/(dashboard)/payment/page.tsx',
  'app/(dashboard)/payment/result/page.tsx',
  'app/(business)/business/page.tsx',
  'app/(business)/business/orders/page.tsx',
  'app/(business)/business/products/page.tsx',
  'app/(business)/business/settings/page.tsx',
  'app/(business)/business/vouchers/page.tsx',
  'app/account/page.tsx'
];

filesToDelete.forEach(file => {
  const absolutePath = path.join(__dirname, file);
  if (fs.existsSync(absolutePath)) {
    try {
      fs.chmodSync(absolutePath, 0o666); // ensure writable
      fs.unlinkSync(absolutePath);
      console.log(`Successfully deleted ${file}`);
    } catch (err) {
      console.error(`Failed to delete ${file}:`, err.message);
    }
  } else {
    console.log(`${file} does not exist`);
  }
});
