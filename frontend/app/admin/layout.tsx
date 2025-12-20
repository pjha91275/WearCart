'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import Cookies from 'js-cookie'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const pathname = usePathname()

    const handleLogout = () => {
        Cookies.remove('token')
        router.push('/login')
    }

    const isActive = (path: string) => {
        return pathname?.startsWith(path) ? 'bg-red-700 text-white' : 'text-gray-300 hover:bg-red-800 hover:text-white'
    }

    return (
        <div className="min-h-screen flex bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white flex-shrink-0 hidden md:flex flex-col">
                <div className="p-6">
                    <h1 className="text-2xl font-bold tracking-wider">ApparelDesk</h1>
                    <p className="text-xs text-gray-400 mt-1">Admin Portal</p>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    <Link
                        href="/admin"
                        className={`block px-4 py-2 rounded-md transition-colors ${pathname === '/admin' ? 'bg-red-700 text-white' : 'text-gray-300 hover:bg-red-800 hover:text-white'}`}
                    >
                        Dashboard
                    </Link>
                    <Link
                        href="/admin/products"
                        className={`block px-4 py-2 rounded-md transition-colors ${isActive('/admin/products')}`}
                    >
                        Products
                    </Link>
                    <Link
                        href="/admin/orders"
                        className={`block px-4 py-2 rounded-md transition-colors ${isActive('/admin/orders')}`}
                    >
                        Orders
                    </Link>
                    <Link
                        href="/admin/coupons"
                        className={`block px-4 py-2 rounded-md transition-colors ${isActive('/admin/coupons')}`}
                    >
                        Coupons
                    </Link>
                    <div className="pt-4 mt-4 border-t border-gray-800">
                        <Link
                            href="/"
                            className="block px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md transition-colors"
                        >
                            ← Back to Website
                        </Link>
                    </div>
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-gray-300 hover:text-white transition-colors"
                    >
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white shadow-sm z-10 p-4 md:hidden flex justify-between items-center">
                    <span className="font-bold text-gray-800">ApparelDesk Admin</span>
                    <button onClick={handleLogout} className="text-sm text-red-600">Logout</button>
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    {children}
                </main>
            </div>
            <ToastContainer position="top-right" />
        </div>
    )
}
