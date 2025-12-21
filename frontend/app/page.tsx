'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import axios from 'axios'
import ProductCard from '@/components/ProductCard'
import Header from '@/components/Header'

interface Product {
  id: number
  productName: string
  productCategory: string
  productType: string
  salesPrice: number
  images: string[]
  published: boolean
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    category: '',
    type: '',
    search: ''
  })

  useEffect(() => {
    fetchProducts()
  }, [filters])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({ published: 'true' })
      if (filters.category) params.append('category', filters.category)
      if (filters.type) params.append('type', filters.type)
      if (filters.search) params.append('search', filters.search)

      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/products?${params}`)
      setProducts(response.data.data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="site-container py-8">
        {/* Hero Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">Find your perfect fit</h1>
            <p className="text-lg text-gray-600 mb-6">Curated styles for every occasion — discover trending apparel and enjoy fast checkout.</p>
            <div className="flex gap-3">
              <Link href="/products" className="btn-primary">Shop Now</Link>
              <Link href="/cart" className="px-4 py-2 rounded-lg border border-gray-200">View Cart</Link>
            </div>
          </div>
          <div className="hidden md:block">
            <img src="/hero-banner.jpg" alt="hero" className="w-full rounded-lg shadow-md object-cover h-72" />
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-3 items-center">
          <div className="flex gap-2">
            {['All', 'Men', 'Women', 'Children', 'Unisex'].map((c) => (
              <button
                key={c}
                onClick={() => setFilters({ ...filters, category: c.toLowerCase() === 'all' ? '' : c.toLowerCase() })}
                className={`px-3 py-1 rounded-full border ${filters.category === (c.toLowerCase() === 'all' ? '' : c.toLowerCase()) ? 'bg-red-600 text-white border-red-600' : 'bg-white text-gray-700'}`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="ml-auto w-full md:w-auto">
            <input
              type="text"
              placeholder="Search products..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg w-full md:w-80"
            />
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

