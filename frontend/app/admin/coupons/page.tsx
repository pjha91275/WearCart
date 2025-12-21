'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import Cookies from 'js-cookie'

export default function AdminCouponsPage() {
    const [coupons, setCoupons] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        discountPercentage: 10,
        code: '',
        endDate: ''
    })

    useEffect(() => {
        const token = Cookies.get('token')
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        }
        fetchCoupons()
    }, [])

    const fetchCoupons = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/coupons`)
            setCoupons(response.data.data || [])
        } catch (error) {
            // Backend might return empty or error if no coupons
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/coupons`, formData)
            toast.success('Discount created successfully')
            setShowForm(false)
            setFormData({ name: '', discountPercentage: 10, code: '', endDate: '' })
            fetchCoupons()
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create discount')
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Coupons & Discounts</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                    {showForm ? 'Cancel' : '+ Create Discount'}
                </button>
            </div>

            {showForm && (
                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-600">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800">New Discount Program</h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Program Name</label>
                            <input
                                required
                                type="text"
                                placeholder="e.g. Winter Sale 2024"
                                className="w-full p-2 border rounded focus:ring-red-500 focus:border-red-500"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Coupon Code</label>
                            <input
                                required
                                type="text"
                                placeholder="e.g. WINTER10"
                                className="w-full p-2 border rounded focus:ring-red-500 focus:border-red-500"
                                value={formData.code}
                                onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Discount (%)</label>
                            <input
                                required
                                type="number"
                                min="1"
                                max="100"
                                className="w-full p-2 border rounded focus:ring-red-500 focus:border-red-500"
                                value={formData.discountPercentage}
                                onChange={e => setFormData({ ...formData, discountPercentage: parseInt(e.target.value) })}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Expiry Date</label>
                            <input
                                required
                                type="date"
                                className="w-full p-2 border rounded focus:ring-red-500 focus:border-red-500"
                                value={formData.endDate}
                                onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                            />
                        </div>
                        <div className="md:col-span-2 pt-2">
                            <button
                                type="submit"
                                className="w-full bg-gray-900 text-white py-2 rounded hover:bg-black transition-colors"
                            >
                                Save Discount Program
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b">
                    <h3 className="font-semibold text-gray-800">Existing Coupons</h3>
                </div>
                {loading ? (
                    <div className="p-12 text-center text-gray-500">Loading coupons...</div>
                ) : coupons.length > 0 ? (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Offer Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {coupons.map((coupon: any) => (
                                <tr key={coupon.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-600">{coupon.code}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{coupon.discountOffer?.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-bold">{coupon.discountOffer?.discountPercentage}%</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${coupon.status === 'unused' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {coupon.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(coupon.expirationDate).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="p-12 text-center text-gray-500">No coupons found. Create your first discount program.</div>
                )}
            </div>
        </div>
    )
}
