'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import axios from 'axios'
import Header from '@/components/Header'
import { useCartStore } from '@/store/cartStore'
import { toast } from 'react-toastify'

interface Product {
    id: number
    productName: string
    productCategory: string
    productType: string
    material?: string
    salesPrice: number
    description?: string
    images: string[]
    currentStock: number
    published: boolean
}

export default function ProductDetailsPage() {
    const params = useParams()
    const { id } = params

    const [product, setProduct] = useState<Product | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [selectedImage, setSelectedImage] = useState(0)
    const [quantity, setQuantity] = useState(1)

    const addToCart = useCartStore((state) => state.addItem)

    useEffect(() => {
        if (id) {
            fetchProduct()
        }
    }, [id])

    const fetchProduct = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/products/${id}`)
            setProduct(response.data.data)
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load product')
        } finally {
            setLoading(false)
        }
    }

    const handleAddToCart = () => {
        if (!product) return

        addToCart({
            productId: product.id,
            productName: product.productName,
            price: product.salesPrice,
            quantity: quantity,
            image: product.images[0] || '/images/logo.png'
        })
        toast.success('Added to cart!')
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="container mx-auto px-4 py-12 text-center">
                    <p className="text-xl">Loading product...</p>
                </div>
            </div>
        )
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="container mx-auto px-4 py-12 text-center">
                    <p className="text-xl text-red-600 mb-4">{error || 'Product not found'}</p>
                    <Link href="/products" className="text-gray-600 underline">Back to products</Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="container mx-auto px-4 py-8">
                <div className="mb-6">
                    <Link href="/products" className="text-gray-500 hover:text-red-600 flex items-center gap-2">
                        ← Back to Products
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

                        {/* Image Gallery */}
                        <div className="space-y-4">
                            <div className="aspect-square relative flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
                                <Image
                                    src={product.images[selectedImage] || '/images/logo.png'}
                                    alt={product.productName}
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>

                            {product.images.length > 1 && (
                                <div className="flex gap-2 overflow-x-auto pb-2">
                                    {product.images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedImage(idx)}
                                            className={`relative w-24 h-24 flex-shrink-0 border-2 rounded-md overflow-hidden ${selectedImage === idx ? 'border-red-600' : 'border-transparent'}`}
                                        >
                                            <Image
                                                src={img}
                                                alt={`${product.productName} view ${idx + 1}`}
                                                fill
                                                className="object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div>
                            <div className="mb-2">
                                <span className="text-sm text-red-600 font-medium tracking-wide uppercase">{product.productCategory} / {product.productType}</span>
                            </div>

                            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.productName}</h1>

                            <div className="flex items-end gap-4 mb-6">
                                <span className="text-4xl font-bold text-gray-900">₹{Number(product.salesPrice).toFixed(2)}</span>
                            </div>

                            <div className="prose prose-sm text-gray-600 mb-8">
                                <p>{product.description || 'No description available for this product.'}</p>
                                {product.material && (
                                    <p className="mt-2"><strong>Material:</strong> {product.material}</p>
                                )}
                            </div>

                            <div className="border-t border-b border-gray-100 py-6 mb-8">
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center border border-gray-300 rounded-lg">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="px-4 py-2 hover:bg-gray-100"
                                        >
                                            -
                                        </button>
                                        <span className="w-12 text-center font-medium">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(Math.min(product.currentStock, quantity + 1))}
                                            className="px-4 py-2 hover:bg-gray-100"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <div className="text-sm">
                                        {product.currentStock > 0 ? (
                                            <span className="text-green-600 font-medium">In Stock ({product.currentStock} available)</span>
                                        ) : (
                                            <span className="text-red-600 font-medium">Out of Stock</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={product.currentStock === 0}
                                    className="flex-1 bg-red-600 text-white font-semibold py-4 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {product.currentStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    )
}
