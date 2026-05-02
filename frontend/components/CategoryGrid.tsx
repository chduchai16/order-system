'use client';

import { Category } from '@/lib/utils/types';

interface CategoryGridProps {
    categories?: Category[];
    onCategoryClick?: (category: Category) => void;
}

const defaultCategories: Category[] = [
    { id: '1', name: 'Phụ nữ', icon: '👗', slug: 'women' },
    { id: '2', name: 'Trẻ em', icon: '👧', slug: 'kids' },
    { id: '3', name: 'Đơn ông', icon: '👕', slug: 'men' },
    { id: '4', name: 'Trong sắc & Phụ kiện', icon: '🕶️', slug: 'accessories' },
    { id: '5', name: 'Đường cong', icon: '👸', slug: 'curves' },
    { id: '6', name: 'Sắc đẹp & Sức khỏe', icon: '💄', slug: 'beauty' },
    { id: '7', name: 'Ẩm thực', icon: '🍽️', slug: 'food' },
    { id: '8', name: 'Đồ chơi & Trò chơi', icon: '🎮', slug: 'toys' },
];

export default function CategoryGrid({ categories = defaultCategories, onCategoryClick }: CategoryGridProps) {
    return (
        <div className="mb-12">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => onCategoryClick?.(category)}
                        className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all hover:scale-105"
                    >
                        {category.icon && (
                            <div className="text-4xl mb-2">{category.icon}</div>
                        )}
                        <p className="text-center text-xs sm:text-sm font-medium text-gray-800 line-clamp-2">
                            {category.name}
                        </p>
                    </button>
                ))}
            </div>
        </div>
    );
}
