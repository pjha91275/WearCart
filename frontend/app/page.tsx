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
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to WearCart
          </h1>
          <p className="text-xl text-gray-600">
            Your Clothing, Digitized
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-4 justify-center">
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">All Categories</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="children">Children</option>
            <option value="unisex">Unisex</option>
          </select>

          <input
            type="text"
            placeholder="Search products..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg flex-1 max-w-md"
          />
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

