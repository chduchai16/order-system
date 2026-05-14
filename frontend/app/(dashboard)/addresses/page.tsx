'use client';

import { useEffect, useState } from 'react';
import { userService } from '@/lib/api/userService';
import { Address } from '@/lib/utils/types';

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: '',
    street: '',
    city: '',
    district: '',
    country: 'Vietnam',
    isDefault: false
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const data = await userService.getAddresses();
      setAddresses(data);
    } catch (err) {
      console.error('Failed to fetch addresses', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await userService.addMyAddress(newAddress);
      setShowAddForm(false);
      setNewAddress({ label: '', street: '', city: '', district: '', country: 'Vietnam', isDefault: false });
      fetchAddresses();
    } catch (err) {
      console.error('Failed to add address', err);
    }
  };

  if (loading) return <div className="text-center py-12">Loading addresses...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Addresses</h1>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          {showAddForm ? 'Cancel' : 'Add New Address'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddAddress} className="bg-white border border-blue-200 rounded-lg p-6 mb-8 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">New Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Label (e.g. Home, Office)</label>
              <input 
                type="text" 
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                value={newAddress.label}
                onChange={e => setNewAddress({...newAddress, label: e.target.value})}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Street</label>
              <input 
                type="text" 
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                value={newAddress.street}
                onChange={e => setNewAddress({...newAddress, street: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
              <input 
                type="text" 
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                value={newAddress.district}
                onChange={e => setNewAddress({...newAddress, district: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input 
                type="text" 
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                value={newAddress.city}
                onChange={e => setNewAddress({...newAddress, city: e.target.value})}
              />
            </div>
            <div className="md:col-span-2 flex items-center">
              <input 
                type="checkbox" 
                id="isDefault"
                className="h-4 w-4 text-blue-600 rounded"
                checked={newAddress.isDefault}
                onChange={e => setNewAddress({...newAddress, isDefault: e.target.checked})}
              />
              <label htmlFor="isDefault" className="ml-2 text-sm text-gray-700">Set as default address</label>
            </div>
          </div>
          <button type="submit" className="mt-6 w-full py-2 bg-blue-600 text-white rounded-md font-medium">Save Address</button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map(addr => (
          <div key={addr.id} className={`bg-white border rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow relative ${addr.isDefault ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200'}`}>
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{addr.label}</span>
              {addr.isDefault && <span className="text-[10px] font-bold text-white bg-blue-500 px-1.5 py-0.5 rounded uppercase">Default</span>}
            </div>
            <p className="text-gray-900 font-medium">{addr.street}</p>
            <p className="text-sm text-gray-600">{addr.district}, {addr.city}</p>
            <p className="text-sm text-gray-600">{addr.country}</p>
            
            <div className="mt-4 pt-3 border-t border-gray-100 flex gap-4">
              <button className="text-xs text-blue-600 font-semibold hover:underline">Edit</button>
              {!addr.isDefault && <button className="text-xs text-gray-500 font-semibold hover:underline">Set Default</button>}
              <button className="text-xs text-red-600 font-semibold hover:underline ml-auto">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
