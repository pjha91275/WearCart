'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import axios from 'axios'
import Cookies from 'js-cookie'
import { toast } from 'react-toastify'

export default function CheckoutPage() {
  const router = useRouter()
  const items = useCartStore((state) => state.items)
  const getTotal = useCartStore((state) => state.getTotal)
  const clearCart = useCartStore((state) => state.clearCart)
  const [couponCode, setCouponCode] = useState('')
  const [validCoupon, setValidCoupon] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const token = Cookies.get('token')
    if (!token) {
      router.push('/login')
      return
    }

    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/me`)
      setUser(response.data.data)
    } catch (error) {
      console.error('Error fetching user:', error)
    }
  }

  const validateCoupon = async () => {
    if (!couponCode) return

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/coupons/validate`,
        { code: couponCode, contactId: user?.contact?.id }
      )
      if (response.data.success) {
        setValidCoupon(response.data.data)
        toast.success('Coupon code applied!')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid coupon code')
      setValidCoupon(null)
    }
  }

  const handlePlaceOrder = async () => {
    if (!user?.contact) {
      toast.error('Please complete your profile')
      return
    }

    setLoading(true)
    try {
      const orderItems = items.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }))

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/sale-orders`,
        {
          customerId: user.contact.id,
          items: orderItems,
          couponCodeId: validCoupon?.id || null
        }
      )

      if (response.data.success) {
        clearCart()
        toast.success('Order placed successfully!')
        router.push(`/orders/${response.data.data.id}`)
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>
  }

  const subtotal = getTotal()
  const discount = validCoupon ? (subtotal * validCoupon.discountPercentage) / 100 : 0
  const total = subtotal - discount

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Order Items</h2>
              {items.map((item) => (
                <div key={item.productId} className="flex justify-between py-2 border-b">
                  <span>{item.productName} x {item.quantity}</span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Apply Coupon</h2>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                />
                <button
                  onClick={validateCoupon}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
                >
                  Apply
                </button>
              </div>
              {validCoupon && (
                <p className="text-green-600 mt-2">
                  {validCoupon.discountPercentage}% discount applied!
                </p>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={handlePlaceOrder}
                disabled={loading || items.length === 0}
                className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

