'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useCartStore } from '@/store/cartStore'
import axios from 'axios'
import Cookies from 'js-cookie'

export default function Header() {
  const [user, setUser] = useState<any>(null)
  const cartItems = useCartStore((state) => state.items)
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  useEffect(() => {
    const token = Cookies.get('token')
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      fetchUser()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/me`)
      setUser(response.data.data)
    } catch (error) {
      console.error('Error fetching user:', error)
      Cookies.remove('token')
    }
  }

  const handleLogout = () => {
    Cookies.remove('token')
    setUser(null)
    window.location.href = '/'
  }

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/images/logo.png"
              alt="WearCart Logo"
              width={50}
              height={50}
              className="object-contain"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                <span className="text-black">Wear</span>
                <span className="text-red-600">Cart</span>
              </h1>
              <p className="text-xs text-gray-500">Your Clothing, Digitized</p>
            </div>
          </Link>

          <nav className="flex items-center space-x-6">
            <Link href="/" className="text-gray-700 hover:text-red-600">
              Home
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-red-600">
              Products
            </Link>
            
            {user ? (
              <>
                <Link href="/orders" className="text-gray-700 hover:text-red-600">
                  My Orders
                </Link>
                <Link href="/cart" className="relative text-gray-700 hover:text-red-600">
                  Cart
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 hover:text-red-600">
                  Login
                </Link>
                <Link href="/register" className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

