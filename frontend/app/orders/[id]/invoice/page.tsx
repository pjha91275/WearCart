'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import Cookies from 'js-cookie'

export default function InvoicePage() {
    const params = useParams()
    const [order, setOrder] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const token = Cookies.get('token')
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        }
        fetchOrder()
    }, [])

    const fetchOrder = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/sale-orders/${params.id}`)
            setOrder(response.data.data)
        } catch (err) {
            setError('Invoice not found or access denied')
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <div className="p-8 text-center">Loading invoice...</div>
    if (error) return <div className="p-8 text-center text-red-600">{error}</div>

    if (!order.invoice) {
        return <div className="p-8 text-center">Invoice has not been generated for this order yet.</div>
    }

    const invoice = order.invoice
    const customer = order.customer

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-4xl mx-auto bg-white shadow-lg p-8 print:shadow-none print:p-0" id="invoice-area">

                {/* Header */}
                <div className="flex justify-between items-start border-b pb-8 mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-800">INVOICE</h1>
                        <p className="text-gray-500 mt-1">#{invoice.id}</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-xl font-bold text-gray-700">ApparelDesk</h2>
                        <p className="text-gray-500 text-sm mt-1">123 Fashion Street</p>
                        <p className="text-gray-500 text-sm">New Delhi, India 110001</p>
                        <p className="text-gray-500 text-sm">contact@appareldesk.com</p>
                    </div>
                </div>

                {/* Bill To & Info */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                        <h3 className="text-gray-600 font-bold uppercase text-xs tracking-wider mb-2">Bill To</h3>
                        <div className="text-gray-800">
                            <p className="font-bold">{customer?.name}</p>
                            <p>{customer?.address?.city}, {customer?.address?.state}</p>
                            <p>{customer?.address?.pincode}</p>
                            <p className="mt-2">{customer?.email}</p>
                            <p>{customer?.mobile}</p>
                        </div>
                    </div>

                    <div className="text-right">
                        <div className="mb-2">
                            <span className="text-gray-600 font-bold uppercase text-xs tracking-wider">Invoice Date:</span>
                            <span className="ml-4 text-gray-800">{new Date(invoice.invoiceDate).toLocaleDateString()}</span>
                        </div>
                        <div className="mb-2">
                            <span className="text-gray-600 font-bold uppercase text-xs tracking-wider">Due Date:</span>
                            <span className="ml-4 text-gray-800">{new Date(invoice.dueDate).toLocaleDateString()}</span>
                        </div>
                        <div>
                            <span className="text-gray-600 font-bold uppercase text-xs tracking-wider">Status:</span>
                            <span className="ml-4 uppercase font-bold text-sm text-green-600">{invoice.status}</span>
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <table className="w-full mb-8">
                    <thead>
                        <tr className="bg-gray-50 border-y border-gray-200">
                            <th className="text-left py-3 px-4 font-bold text-gray-600 text-sm uppercase">Item</th>
                            <th className="text-right py-3 px-4 font-bold text-gray-600 text-sm uppercase">Qty</th>
                            <th className="text-right py-3 px-4 font-bold text-gray-600 text-sm uppercase">Price</th>
                            <th className="text-right py-3 px-4 font-bold text-gray-600 text-sm uppercase">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {order.items.map((item: any) => (
                            <tr key={item.id}>
                                <td className="py-4 px-4">
                                    <p className="font-medium text-gray-900">{item.product?.productName}</p>
                                    <p className="text-sm text-gray-500">{item.product?.productType}</p>
                                </td>
                                <td className="text-right py-4 px-4 text-gray-700">{item.quantity}</td>
                                <td className="text-right py-4 px-4 text-gray-700">₹{item.unitPrice}</td>
                                <td className="text-right py-4 px-4 text-gray-900 font-medium">₹{item.subtotal}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Totals */}
                <div className="border-t pt-8 flex justify-end">
                    <div className="w-64 space-y-3">
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span>₹{invoice.subtotal}</span>
                        </div>
                        {invoice.discount > 0 && (
                            <div className="flex justify-between text-green-600">
                                <span>Discount</span>
                                <span>-₹{invoice.discount}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-gray-600">
                            <span>Tax</span>
                            <span>₹{invoice.tax}</span>
                        </div>
                        <div className="flex justify-between text-xl font-bold text-gray-900 border-t pt-3">
                            <span>Total</span>
                            <span>₹{invoice.total}</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-16 text-center text-sm text-gray-500 print:mt-8">
                    <p>Thank you for your business!</p>
                    <p className="mt-2">Payment Terms: {order.paymentTerm?.name}</p>
                </div>

            </div>

            {/* Print Action */}
            <div className="max-w-4xl mx-auto mt-8 text-right print:hidden px-4">
                <button
                    onClick={() => window.print()}
                    className="bg-gray-800 text-white px-6 py-2 rounded shadow hover:bg-gray-900"
                >
                    Print Invoice
                </button>
            </div>
        </div>
    )
}
