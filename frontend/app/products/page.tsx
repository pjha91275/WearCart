'use client'

import { useState, useEffect, Suspense } from 'react'
import axios from 'axios'
import Header from '@/components/Header'
import ProductCard from '@/components/ProductCard'
import { useRouter, useSearchParams } from 'next/navigation'

export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsContent />
    </Suspense>
  )
}

function ProductsContent() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()
  const [filters, setFilters] = useState({
    category: '',
    type: '',
    search: '',
    minPrice: '',
    maxPrice: ''
  })

  useEffect(() => {
    if (searchParams) {
      setFilters(prev => ({
        ...prev,
        search: searchParams.get('search') || '',
        category: searchParams.get('category') || '',
        type: searchParams.get('type') || ''
      }))
    }
  }, [searchParams])

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams()
    // Persist existing state, but override with new value
    // We use 'filters' state as base to preserve any unsaved typing (though better to use URL usually)
    // Actually, safer to use current URL params + override, but to support the search input preservation:
    if (filters.search) params.set('search', filters.search)
    if (filters.category) params.set('category', filters.category)
    if (filters.type) params.set('type', filters.type)

    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }

    // Ensure we handle 'All' logic by deletion if value is empty
    router.push(`/products?${params.toString()}`)
  }

  useEffect(() => {
    fetchProducts()
  }, [filters.category, filters.type])

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts()
    }, 500)
    return () => clearTimeout(timer)
  }, [filters.search])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({ published: 'true' })
      if (filters.category) params.append('category', filters.category)
      if (filters.type) params.append('type', filters.type)
      if (filters.search) params.append('search', filters.search)

      // Note: Backend might need update to support price range, capturing here for UI
      // If backend doesn't support it yet, we can filter client side or just send it if supported

      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/products?${params}`)
      setProducts(response.data.data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = ['All', 'T-Shirt', 'Jeans', 'Dress', 'Jacket', 'Shirt', 'Suit']
  const types = ['All', 'Men', 'Women', 'Children', 'Unisex']

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-24">
              <h2 className="text-lg font-bold mb-4">Filters</h2>

              <div className="mb-6">
                <h3 className="font-semibold mb-2">Types</h3>
                <div className="space-y-2">
                  {types.map((t) => (
                    <label key={t} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="type"
                        checked={filters.type === (t === 'All' ? '' : t.toLowerCase())}
                        onChange={() => updateFilter('type', t === 'All' ? '' : t.toLowerCase())}
                        className="text-red-600 focus:ring-red-500"
                      />
                      <span>{t}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-2">Category</h3>
                <div className="space-y-2">
                  {categories.map((c) => (
                    <label key={c} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={filters.category === (c === 'All' ? '' : c.toLowerCase())}
                        onChange={() => updateFilter('category', c === 'All' ? '' : c.toLowerCase())}
                        className="text-red-600 focus:ring-red-500"
                      />
                      <span>{c}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    updateFilter('search', filters.search)
                  }
                }}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm"
              />
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow h-80 animate-pulse">
                    <div className="h-48 bg-gray-200 w-full rounded-t-lg"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 w-3/4 rounded"></div>
                      <div className="h-4 bg-gray-200 w-1/2 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-lg shadow-sm">
                <p className="text-xl text-gray-500">No products found fitting your criteria.</p>
                <button
                  onClick={() => router.push('/products')}
                  className="mt-4 text-red-600 hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
