'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'
import { toast } from 'react-toastify'

interface Product {
  id: number
  productName: string
  productCategory: string
  productType: string
  salesPrice: number
  images: string[]
  published: boolean
}

export default function ProductCard({ product }: { product: Product }) {
  const addToCart = useCartStore((state) => state.addItem)

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      productName: product.productName,
      price: product.salesPrice,
      quantity: 1,
      image: product.images[0] || '/images/logo.png'
    })
    toast.success('Product added to cart!')
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      <Link href={`/products/${product.id}`}>
        <div className="relative h-64 w-full">
          <Image
            src={product.images[0] || '/images/logo.png'}
            alt={product.productName}
            fill
            className="object-cover"
          />
        </div>
      </Link>
      
      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-red-600">
            {product.productName}
          </h3>
        </Link>
        
        <p className="text-sm text-gray-600 mb-2">
          {product.productType} • {product.productCategory}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-red-600">
            ₹{product.salesPrice.toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

