'use client';

import { ProductAttribute } from '../types';

interface ProductSpecificationsProps {
  attributes: ProductAttribute[];
}

export default function ProductSpecifications({ attributes }: ProductSpecificationsProps) {
  if (!attributes || attributes.length === 0) return null;

  return (
    <div className="mt-6 border-t border-gray-100 pt-4">
      <h4 className="text-sm font-semibold text-gray-700 mb-3">Specifications:</h4>
      <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200">
          <tbody className="bg-white divide-y divide-gray-200">
            {attributes.map((attr, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-2 text-sm font-medium text-gray-500 w-1/3">
                  {attr.name}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900">
                  {attr.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
