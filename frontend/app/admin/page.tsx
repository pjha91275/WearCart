'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Cookies from 'js-cookie'
import Link from 'next/link'

export default function AdminDashboard() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<any>(null)
    const [stats, setStats] = useState({
        products: 0,
        orders: 0
    })

    useEffect(() => {
        const checkAuth = async () => {
            const token = Cookies.get('token')
            if (!token) {
                router.push('/login')
                return
            }

            try {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/me`)

                if (response.data.data.role !== 'internal') {
                    router.push('/')
                    return
                }

                setUser(response.data.data)

                // Fetch quick stats
                // Note: Ideally backend should have a dashboard stats endpoint. 
                // We'll just generic fetch list counts for now if possible, else just show static for MVP
                try {
                    // Parallel fetch for counts if endpoints allow basic listing without pagination (or we just take page 1 counts)
                    // Not optimized but works for MVP
                    const [prodRes, orderRes] = await Promise.all([
                        axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/products`),
                        axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/sale-orders?limit=1`)
                    ])
                    setStats({
                        products: prodRes.data.count || prodRes.data.data?.length || 0,
                        orders: orderRes.data.count || 0
                    })
                } catch (e) {
                    console.error('Failed to load stats', e)
                }

            } catch (error) {
                router.push('/login')
            } finally {
                setLoading(false)
            }
        }

        checkAuth()
    }, [])

    if (loading) {
        return <div className="flex h-full items-center justify-center">Loading admin portal...</div>
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
                    <h3 className="text-gray-500 text-sm uppercase font-semibold">Total Products</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{stats.products}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
                    <h3 className="text-gray-500 text-sm uppercase font-semibold">Total Orders</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{stats.orders}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-500">
                    <h3 className="text-gray-500 text-sm uppercase font-semibold">System Status</h3>
                    <p className="text-lg font-bold text-gray-800 mt-2">Active</p>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                <div className="flex gap-4">
                    <Link href="/admin/products" className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors">
                        Manage Products
                    </Link>
                    <Link href="/admin/orders" className="bg-green-50 text-green-700 px-4 py-2 rounded-lg hover:bg-green-100 transition-colors">
                        View Orders
                    </Link>
                </div>
            </div>
        </div>
    )
}
