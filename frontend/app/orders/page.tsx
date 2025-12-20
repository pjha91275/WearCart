'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Cookies from 'js-cookie'
import Header from '@/components/Header'

interface Order {
    id: number
    total: number
    status: string
    createdAt: string
    items: any[]
}

export default function OrdersPage() {
    const router = useRouter()
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const token = Cookies.get('token')
        if (!token) {
            router.push('/login')
            return
        }

        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        fetchOrders()
    }, [])

    const fetchOrders = async () => {
        try {
            setLoading(true)
            // Assuming GET /api/sale-orders returns orders for the logged-in user (based on token)
            // The backend controller code I saw earlier 'getSaleOrders' filters by customerId if provided in query,
            // but usually 'protect' middleware should attach user info and controller should filter by that.
            // Looking at the controller:
            // if (customerId) where.customerId = customerId;
            // We need to fetch the current user's contact ID first or trust the backend to handle 'my orders'.
            // Let's first fetch 'me' to get the contact ID.

            const meResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/me`)
            const contactId = meResponse.data.data.contact?.id

            if (!contactId) {
                // If user has no contact profile yet, they probably have no orders
                setOrders([])
                setLoading(false)
                return
            }

            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/sale-orders?customerId=${contactId}`)
            setOrders(response.data.data || [])
        } catch (err: any) {
            console.error(err)
            setError('Failed to load orders')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">My Orders</h1>

                {loading ? (
                    <div className="text-center py-12">Loading orders...</div>
                ) : error ? (
                    <div className="text-center py-12 text-red-600">{error}</div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
                        <Link href="/products" className="btn-primary">Start Shopping</Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white rounded-lg shadow-sm p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Order #{order.id}</p>
                                    <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    <div className="mt-2 text-sm">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${order.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-gray-100 text-gray-800'
                                            }`}>
                                            {order.status.toUpperCase()}
                                        </span>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <p className="font-bold text-lg mb-2">₹{Number(order.total).toFixed(2)}</p>
                                    <Link
                                        href={`/orders/${order.id}`}
                                        className="text-red-600 hover:text-red-700 font-medium text-sm"
                                    >
                                        View Details →
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}
