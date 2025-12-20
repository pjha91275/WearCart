'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

export default function AdminCouponsPage() {
    const [coupons, setCoupons] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchCoupons()
    }, [])

    const fetchCoupons = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/coupons`)
            setCoupons(response.data.data || [])
        } catch (error) {
            //   toast.error('Failed to fetch coupons') 
            // Backend might return empty or error if no coupons, just ignore for now
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Coupons & Discounts</h1>
                <button
                    disabled
                    className="bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed"
                    title="Feature coming soon"
                >
                    + Create Discount
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden p-6">
                <p className="text-gray-500">Coupon management implementation pending backend API adjustments.</p>

                {/* Placeholder for list */}
                {coupons.length > 0 && (
                    <table className="min-w-full divide-y divide-gray-200 mt-4">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {coupons.map((coupon: any) => (
                                <tr key={coupon.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">{coupon.code}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{coupon.status}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{new Date(coupon.expirationDate).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}
