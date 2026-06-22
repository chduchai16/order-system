export const PRODUCT_CATEGORIES = [
  { id: 1, name: 'Food - Bakery' },
  { id: 2, name: 'Food - Drinks' },
  { id: 3, name: 'Food - Pantry' },
  { id: 4, name: 'Food - Snacks' },
  { id: 5, name: 'Craft - Jewelry' },
  { id: 6, name: 'Craft - Home Decor' },
  { id: 7, name: 'Craft - Accessories' },
  { id: 8, name: 'Craft - Stationery' },
];

export const STOREFRONT_CATEGORIES = [
  { name: 'Tất cả sản phẩm', count: '1.2k', slug: 'all' },
  { name: 'Ý tưởng Quà tặng', count: '234', slug: 'gifts' },
  { name: 'Quà Ngày của Cha', count: '89', slug: 'fathers-day' },
  { name: 'Đồ gia dụng & Trang trí', count: '156', slug: 'home-living' },
  { name: 'Thời trang tuyển chọn', count: '412', slug: 'fashion' },
  { name: 'Trang sức & Phụ kiện', count: '98', slug: 'jewelry' },
  { name: 'Đồ thủ công & Nghệ thuật', count: '184', slug: 'crafts' },
];

export const MEGA_CATEGORIES = [
  {
    key: 'home-living',
    name: 'Gốm sứ & Gia dụng',
    slug: 'home-living',
    subCategories: [
      { name: 'Cốc & Ly sứ', slug: 'home-living', imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300&auto=format&fit=crop&q=80' },
      { name: 'Bình hoa gốm', slug: 'home-living', imageUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=300&auto=format&fit=crop&q=80' },
      { name: 'Ấm & Chén trà', slug: 'home-living', imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=300&auto=format&fit=crop&q=80' },
      { name: 'Khay gỗ & Dĩa', slug: 'home-living', imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&auto=format&fit=crop&q=80' },
    ]
  },
  {
    key: 'jewelry',
    name: 'Trang sức bạc & Đá',
    slug: 'jewelry',
    subCategories: [
      { name: 'Nhẫn bạc', slug: 'jewelry', imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=300&auto=format&fit=crop&q=80' },
      { name: 'Dây chuyền', slug: 'jewelry', imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&auto=format&fit=crop&q=80' },
      { name: 'Bông tai', slug: 'jewelry', imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300&auto=format&fit=crop&q=80' },
      { name: 'Vòng tay trầm', slug: 'jewelry', imageUrl: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=300&auto=format&fit=crop&q=80' },
    ]
  },
  {
    key: 'candles',
    name: 'Nến thơm & Tinh dầu',
    slug: 'crafts',
    subCategories: [
      { name: 'Nến thơm sáp', slug: 'crafts', imageUrl: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=300&auto=format&fit=crop&q=80' },
      { name: 'Tinh dầu treo', slug: 'crafts', imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=300&auto=format&fit=crop&q=80' },
      { name: 'Sáp thơm treo', slug: 'crafts', imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=300&auto=format&fit=crop&q=80' },
    ]
  },
  {
    key: 'art',
    name: 'Tranh vẽ & Nghệ thuật',
    slug: 'crafts',
    subCategories: [
      { name: 'Tranh thêu tay', slug: 'crafts', imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=300&auto=format&fit=crop&q=80' },
      { name: 'Tranh in Canvas', slug: 'crafts', imageUrl: 'https://images.unsplash.com/photo-1501472312651-726afd116ff1?w=300&auto=format&fit=crop&q=80' },
      { name: 'Tranh sơn mài', slug: 'crafts', imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=300&auto=format&fit=crop&q=80' },
    ]
  },
  {
    key: 'fashion',
    name: 'Thời trang & Túi',
    slug: 'fashion',
    subCategories: [
      { name: 'Áo thun thêu', slug: 'fashion', imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300&auto=format&fit=crop&q=80' },
      { name: 'Túi tote linen', slug: 'fashion', imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=300&auto=format&fit=crop&q=80' },
      { name: 'Khăn choàng len', slug: 'fashion', imageUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=300&auto=format&fit=crop&q=80' },
      { name: 'Mũ len móc', slug: 'fashion', imageUrl: 'https://images.unsplash.com/photo-1576871337622-98d48d4353c0?w=300&auto=format&fit=crop&q=80' },
    ]
  },
  {
    key: 'leather',
    name: 'Sổ tay & Đồ da bò',
    slug: 'fashion',
    subCategories: [
      { name: 'Sổ tay da bò', slug: 'fashion', imageUrl: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=300&auto=format&fit=crop&q=80' },
      { name: 'Ví da nam', slug: 'fashion', imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=300&auto=format&fit=crop&q=80' },
      { name: 'Bao da iPad', slug: 'fashion', imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=300&auto=format&fit=crop&q=80' },
    ]
  },
  {
    key: 'gifts',
    name: 'Ý tưởng quà tặng',
    slug: 'gifts',
    subCategories: [
      { name: 'Quà sinh nhật', slug: 'gifts', imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=300&auto=format&fit=crop&q=80' },
      { name: 'Quà tân gia', slug: 'gifts', imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=300&auto=format&fit=crop&q=80' },
      { name: 'Quà cho Cha', slug: 'fathers-day', imageUrl: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=300&auto=format&fit=crop&q=80' },
      { name: 'Hộp quà combo', slug: 'gifts', imageUrl: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?w=300&auto=format&fit=crop&q=80' },
    ]
  }
];
