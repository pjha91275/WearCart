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
    <header className="bg-[#F6F5FA] shadow sticky top-0 z-30">
      <div className="site-container py-4 flex items-center gap-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.jpeg" alt="logo" className="w-60 object-contain" />

          </Link>
        </div>

        <div className="flex-1 hidden md:flex items-center">
          <div className="relative w-full max-w-xl">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1012 19.5a7.5 7.5 0 004.65-2.85z" />
              </svg>
            </span>
            <input
              type="search"
              placeholder="Search for products, brands and more"
              className="w-full pl-11 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200"
            />
          </div>
        </div>

        <nav className="flex items-center gap-4">
          <Link href="/products" className="hidden md:inline text-gray-700 hover:text-red-600">Products</Link>
          {user ? (
            <>
              {user.role === 'internal' && (
                <Link href="/admin" className="text-red-600 hover:text-red-800 font-bold mr-2">
                  Admin Panel
                </Link>
              )}
              <Link href="/orders" className="text-gray-700 hover:text-red-600">My Orders</Link>
              <button onClick={handleLogout} className="text-gray-700 hover:text-red-600">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-700 hover:text-red-600">Login</Link>
              <Link href="/register" className="btn-primary">Sign Up</Link>
            </>
          )}

          <Link href="/cart" className="relative inline-flex items-center p-2 rounded-lg hover:bg-gray-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 13l-1.5 6h13L17 13" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{cartCount}</span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  )
}

