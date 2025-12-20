'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'
import { toast } from 'react-toastify'

export default function AdminOrderDetailPage() {
    const params = useParams()
    const router = useRouter()
    const [order, setOrder] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchOrder()
    }, [])

    const fetchOrder = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/sale-orders/${params.id}`)
            setOrder(response.data.data)
        } catch (error) {
            toast.error('Failed to load order')
            router.push('/admin/orders')
        } finally {
            setLoading(false)
        }
    }

    const updateStatus = async (newStatus: string) => {
        try {
            // Note: Backend might need a specific endpoint for status update or generic PUT
            // Logic: usually PUT /sale-orders/:id with { status: ... }
            // I will assume the backend supports generic update on PUT /:id
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/sale-orders/${order.id}`, { status: newStatus })
            setOrder({ ...order, status: newStatus })
            toast.success(`Order status updated to ${newStatus}`)
        } catch (error) {
            toast.error('Failed to update status')
        }
    }

    const generateInvoice = async () => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/sale-orders/${order.id}/invoice`)
            setOrder({ ...order, invoice: response.data.data })
            toast.success('Invoice generated successfully')
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to generate invoice')
        }
    }

    if (loading || !order) return <div>Loading details...</div>

    return (
        <div>
            <div className="flex justify-between items-start mb-6">
                <div>
                    <Link href="/admin/orders" className="text-gray-500 hover:text-gray-900 text-sm mb-2 block">← Back to Orders</Link>
                    <h1 className="text-2xl font-bold flex items-center gap-3">
                        Order #{order.id}
                        <span className="text-sm px-3 py-1 bg-gray-200 rounded-full font-normal text-gray-700 uppercase">{order.status}</span>
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Placed on {new Date(order.createdAt).toLocaleString()}</p>
                </div>

                <div className="flex gap-3">
                    {/* Status Actions */}
                    {order.status === 'confirmed' && (
                        <button onClick={() => updateStatus('shipped')} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Mark Shipped</button>
                    )}
                    {order.status === 'shipped' && (
                        <button onClick={() => updateStatus('delivered')} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Mark Delivered</button>
                    )}

                    {/* Invoice Actions */}
                    {!order.invoice ? (
                        <button onClick={generateInvoice} className="border border-gray-300 bg-white px-4 py-2 rounded hover:bg-gray-50">Generate Invoice</button>
                    ) : (
                        <Link href={`/orders/${order.id}/invoice`} target="_blank" className="border border-gray-300 bg-white px-4 py-2 rounded hover:bg-gray-50 text-gray-700">
                            View Invoice
                        </Link>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Items */}
                <div className="md:col-span-2 bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-bold mb-4">Items</h2>
                    <div className="divide-y">
                        {order.items.map((item: any) => (
                            <div key={item.id} className="py-4 flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <div className="font-medium">{item.product?.productName}</div>
                                    <div className="text-gray-500 text-sm">x {item.quantity}</div>
                                </div>
                                <div className="font-bold">₹{item.subtotal}</div>
                            </div>
                        ))}
                    </div>
                    <div className="border-t mt-4 pt-4 space-y-2 text-right">
                        <div className="text-gray-600">Subtotal: <span className="font-medium text-gray-900">₹{order.subtotal}</span></div>
                        {order.discount > 0 && <div className="text-green-600">Discount: <span className="font-medium">-₹{order.discount}</span></div>}
                        <div className="text-gray-600">Tax: <span className="font-medium text-gray-900">₹{order.tax}</span></div>
                        <div className="text-xl font-bold text-gray-900 mt-2">Total: ₹{order.total}</div>
                    </div>
                </div>

                {/* Customer Info */}
                <div className="bg-white rounded-lg shadow p-6 h-fit">
                    <h2 className="text-xl font-bold mb-4">Customer Details</h2>
                    <div className="space-y-3">
                        <div>
                            <span className="block text-sm text-gray-500">Name</span>
                            <span className="font-medium">{order.customer?.name}</span>
                        </div>
                        <div>
                            <span className="block text-sm text-gray-500">Email</span>
                            <span className="font-medium">{order.customer?.email}</span>
                        </div>
                        <div>
                            <span className="block text-sm text-gray-500">Phone</span>
                            <span className="font-medium">{order.customer?.mobile || 'N/A'}</span>
                        </div>
                        <div>
                            <span className="block text-sm text-gray-500">Payment Term</span>
                            <span className="font-medium">{order.paymentTerm?.name}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
