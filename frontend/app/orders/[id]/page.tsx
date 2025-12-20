'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import axios from 'axios'
import Cookies from 'js-cookie'
import Header from '@/components/Header'

interface OrderItem {
    id: number
    quantity: number
    unitPrice: number
    subtotal: number
    product: {
        id: number
        productName: string
        images: string[]
    }
}

interface Order {
    id: number
    total: number
    subtotal: number
    tax: number
    discount: number
    status: string
    createdAt: string
    items: OrderItem[]
    customer: {
        name: string
        email: string
    }
}

export default function OrderDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const { id } = params

    const [order, setOrder] = useState<Order | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const token = Cookies.get('token')
        if (!token) {
            router.push('/login')
            return
        }

        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        if (id) fetchOrder()
    }, [id])

    const fetchOrder = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/sale-orders/${id}`)
            setOrder(response.data.data)
        } catch (err: any) {
            console.error(err)
            setError('Failed to load order details')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="container mx-auto px-4 py-12 text-center">Loading order details...</div>
            </div>
        )
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="container mx-auto px-4 py-12 text-center text-red-600">
                    {error || 'Order not found'}
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="container mx-auto px-4 py-8">
                <div className="mb-6">
                    <Link href="/orders" className="text-gray-500 hover:text-red-600">← Back to My Orders</Link>
                </div>

                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {/* Order Header */}
                    <div className="border-b border-gray-100 p-6 bg-gray-50">
                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Order #{order.id}</h1>
                                <p className="text-sm text-gray-500">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${order.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-gray-100 text-gray-800'
                                    }`}>
                                    {order.status.toUpperCase()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="p-6">
                        <h2 className="font-semibold text-lg mb-4">Items</h2>
                        <div className="space-y-6">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex items-center gap-4 py-2 border-b last:border-0 border-gray-100">
                                    <div className="relative w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                        <Image
                                            src={item.product.images[0] || '/images/logo.png'}
                                            alt={item.product.productName}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900">{item.product.productName}</h3>
                                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">₹{Number(item.unitPrice).toFixed(2)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-gray-50 p-6 border-t border-gray-100">
                        <div className="flex flex-col gap-2 ml-auto max-w-xs">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>₹{Number(order.subtotal).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Tax</span>
                                <span>₹{Number(order.tax).toFixed(2)}</span>
                            </div>
                            {order.discount > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>Discount</span>
                                    <span>-₹{Number(order.discount).toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-lg font-bold text-gray-900 border-t border-gray-200 pt-2 mt-2">
                                <span>Total</span>
                                <span>₹{Number(order.total).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
