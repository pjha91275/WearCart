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
  salesPrice: number | string
  images: string[]
  published: boolean
}

export default function ProductCard({ product }: { product: Product }) {
  const addToCart = useCartStore((state) => state.addItem)

  const handleAddToCart = () => {
    const price = Number(product.salesPrice || 0)
    addToCart({
      productId: product.id,
      productName: product.productName,
      price,
      quantity: 1,
      image: product.images[0] || '/images/logo.png'
    })
    toast.success('Product added to cart!')
  }

  return (
    <div className="card">
      <Link href={`/products/${product.id}`}>
        <div className="ratio-1-1 w-full relative bg-gray-100">
          <Image
            src={product.images[0] || '/images/logo.png'}
            alt={product.productName}
            fill
            className="object-cover"
          />
          {product.published && (
            <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">New</span>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="text-md font-semibold text-gray-900 mb-1 hover:text-red-600">
            {product.productName}
          </h3>
        </Link>

        <p className="text-sm text-gray-500 mb-3">
          {product.productType} • {product.productCategory}
        </p>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-bold text-red-600">₹{Number(product.salesPrice || 0).toFixed(0)}</div>
            <div className="text-xs text-gray-400">Inclusive of taxes</div>
          </div>

          <button
            onClick={handleAddToCart}
            className="btn-primary"
            aria-label={`Add ${product.productName} to cart`}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  )
}

