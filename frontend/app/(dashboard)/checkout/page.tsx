'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCartStore } from '@/lib/store/cartStore';
import { orderService } from '@/lib/api/orderService';
import { userService } from '@/lib/api/userService';
import { tokenStore } from '@/lib/api/tokenStore';
import { CreateOrderRequest, Address } from '@/lib/utils/types';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'VNPAY'>('COD');
  
  // User Data
  const [userAddresses, setUserAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);

  // Address State (for manual entry or selected)
  const [address, setAddress] = useState({
    street: '',
    city: '',
    district: '',
    country: 'Vietnam'
  });

  const subtotal = getTotalPrice();
  const shippingFee = 30000; // VND
  const taxAmount = subtotal * 0.1; // 10% VAT
  const total = subtotal + shippingFee + taxAmount;

  useEffect(() => {
    const fetchUserAddresses = async () => {
      try {
        const profile = await userService.getProfile();
        if (profile.addresses) {
          setUserAddresses(profile.addresses);
          const defaultAddr = profile.addresses.find(a => a.isDefault);
          if (defaultAddr) {
            setSelectedAddressId(defaultAddr.id || null);
            setAddress({
              street: defaultAddr.street,
              city: defaultAddr.city,
              district: defaultAddr.district,
              country: defaultAddr.country
            });
          }
        }
      } catch (err) {
        console.error('Failed to fetch addresses', err);
      }
    };

    fetchUserAddresses();
  }, []);

  if (items.length === 0 && !success) {
    return (
      <div className="text-center py-12 bg-white border border-gray-200 rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold mb-4 text-gray-900">Checkout</h1>
        <p className="text-gray-600 mb-6">Your cart is empty</p>
        <Link href="/products" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors inline-block">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const handleSelectAddress = (addr: Address) => {
    setSelectedAddressId(addr.id || null);
    setAddress({
      street: addr.street,
      city: addr.city,
      district: addr.district,
      country: addr.country
    });
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedAddressId(null);
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSubmitOrder = async () => {
    if (!address.street || !address.city || !address.district) {
      setError('Please fill in all shipping fields');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const userId = tokenStore.getUserId();
      if (!userId) {
        throw new Error('User is not authenticated');
      }

      const orderRequest: CreateOrderRequest = {
        userId,
        items: items.map(item => ({
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.unitPrice
        })),
        totalPrice: total,
        street: address.street,
        city: address.city,
        district: address.district,
        country: address.country,
        shippingCarrier: 'Giao Hang Nhanh',
        discountCode: ''
      };

      await orderService.createOrder(orderRequest);

      if (paymentMethod === 'VNPAY') {
        alert('Đang mở cổng thanh toán VNPay... (Tính năng đang được tích hợp)');
        window.open('https://sandbox.vnpayment.vn/apis/vnpay-demo/', '_blank');
      }

      setSuccess(true);
      clearCart();
      
      setTimeout(() => {
        router.push('/orders');
      }, 1500);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      const errorMsg = e.response?.data?.message || e.message || 'Failed to create order';
      setError(errorMsg);
      console.error('Order creation error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-12 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="inline-block mb-4 text-5xl text-green-500">✓</div>
        <h1 className="text-2xl font-bold mb-4 text-gray-900">Order Placed Successfully!</h1>
        <p className="text-gray-600 mb-6">Redirecting to your orders...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Order Review */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4 text-gray-900 border-b pb-2">Order Review</h2>
            <div className="space-y-4">
              {items.map(item => (
                <div key={item.productId} className="flex justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">IMG</div>
                    <div>
                      <p className="font-medium text-gray-900">{item.productName}</p>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity} x ${(item.unitPrice || 0).toFixed(2)}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-900">${((item.unitPrice || 0) * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4 text-gray-900 border-b pb-2">Shipping Address</h2>
            
            {userAddresses.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select from saved addresses:</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {userAddresses.map((addr) => (
                    <div 
                      key={addr.id}
                      onClick={() => handleSelectAddress(addr)}
                      className={`p-3 border rounded-lg cursor-pointer transition-all ${
                        selectedAddressId === addr.id 
                          ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold uppercase text-blue-600">{addr.label}</span>
                        {addr.isDefault && <span className="text-[10px] bg-gray-100 px-1 rounded">Default</span>}
                      </div>
                      <p className="text-sm mt-1 text-gray-800 line-clamp-1">{addr.street}</p>
                      <p className="text-xs text-gray-500">{addr.district}, {addr.city}</p>
                    </div>
                  ))}
                </div>
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t"></span></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-500">Or enter manually</span></div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                <input
                  type="text"
                  name="street"
                  value={address.street}
                  onChange={handleAddressChange}
                  placeholder="123 Street Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                <input
                  type="text"
                  name="district"
                  value={address.district}
                  onChange={handleAddressChange}
                  placeholder="District 1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={address.city}
                  onChange={handleAddressChange}
                  placeholder="Ho Chi Minh"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                  required
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4 text-gray-900 border-b pb-2">Payment Method</h2>
            <div className="space-y-4">
              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <div className="ml-3">
                  <span className="block text-sm font-medium text-gray-900">Cash on Delivery (COD)</span>
                  <span className="block text-sm text-gray-500">Pay when you receive the order</span>
                </div>
              </label>

              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="VNPAY"
                  checked={paymentMethod === 'VNPAY'}
                  onChange={() => setPaymentMethod('VNPAY')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <div className="ml-3 flex items-center gap-2">
                  <span className="block text-sm font-medium text-gray-900">VNPay Gateway</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    Online
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm sticky top-24">
            <h2 className="text-lg font-bold mb-4 text-gray-900">Order Summary</h2>
            <div className="space-y-3 border-t border-gray-200 pt-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal ({items.length} items)</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping Fee</span>
                <span>${shippingFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Tax (VAT 10%)</span>
                <span>${taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-gray-900 border-t border-gray-200 pt-4 mt-2">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleSubmitOrder}
              disabled={loading}
              className="w-full mt-6 flex justify-center py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>

            <Link
              href="/cart"
              className="w-full mt-3 flex justify-center py-2.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Back to Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
