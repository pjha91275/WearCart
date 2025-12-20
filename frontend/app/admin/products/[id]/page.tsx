'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import axios from 'axios'
import { toast } from 'react-toastify'
import Link from 'next/link'
import Cookies from 'js-cookie'

export default function AdminProductForm() {
    const router = useRouter()
    const params = useParams()
    const id = params.id === 'new' ? null : params.id

    const [loading, setLoading] = useState(false)
    // Form state
    const [formData, setFormData] = useState({
        productName: '',
        productCategory: 'men',
        productType: 'Shirt',
        material: '',
        salesPrice: 0,
        salesTax: 5,
        purchasePrice: 0,
        purchaseTax: 5,
        currentStock: 0,
        description: '',
        published: true,
        // Existing images (URLs)
        images: [] as string[]
    })

    // New files to upload
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])

    // Auth Header
    useEffect(() => {
        const token = Cookies.get('token')
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        }
    }, [])

    useEffect(() => {
        if (id) {
            fetchProduct()
        }
    }, [id])

    const fetchProduct = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/products/${id}`)
            const product = response.data.data
            setFormData({
                productName: product.productName,
                productCategory: product.productCategory,
                productType: product.productType,
                material: product.material || '',
                salesPrice: product.salesPrice,
                salesTax: product.salesTax,
                purchasePrice: product.purchasePrice,
                purchaseTax: product.purchaseTax,
                currentStock: product.currentStock,
                description: product.description || '',
                published: product.published,
                images: product.images || []
            })
        } catch (error) {
            toast.error('Failed to load product')
            router.push('/admin/products')
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedFiles(Array.from(e.target.files))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const data = new FormData()

            // Append simple fields
            data.append('productName', formData.productName)
            data.append('productCategory', formData.productCategory)
            data.append('productType', formData.productType)
            data.append('material', formData.material)
            data.append('salesPrice', String(formData.salesPrice))
            data.append('salesTax', String(formData.salesTax))
            data.append('purchasePrice', String(formData.purchasePrice))
            data.append('purchaseTax', String(formData.purchaseTax))
            data.append('currentStock', String(formData.currentStock))
            data.append('description', formData.description)
            data.append('published', String(formData.published))

            // Append existing images that indicate they should be kept
            // (The backend logic I implemented appends... so we might need to handle deletions differently later.
            // For now, let's just send the file uploads as 'images')

            // Append files
            selectedFiles.forEach(file => {
                data.append('images', file)
            })

            // Note: If you want to keep existing image URLs or send manual ones,
            // we should technically append them as 'imageUrls' or handle them in backend.
            // My backend controller update supports `imageUrls` in body.
            // But FormData fields must be unique or handled as arrays.
            if (formData.images.length > 0) {
                formData.images.forEach(url => data.append('imageUrls', url));
            }

            const config = {
                headers: { 'Content-Type': 'multipart/form-data' }
            }

            if (id) {
                await axios.put(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/products/${id}`, data, config)
                toast.success('Product updated')
            } else {
                await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/products`, data, config)
                toast.success('Product created')
            }
            router.push('/admin/products')
        } catch (error: any) {
            console.error(error)
            toast.error(error.response?.data?.message || 'Failed to save product')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">{id ? 'Edit Product' : 'New Product'}</h1>
                <Link href="/admin/products" className="text-gray-600 hover:text-gray-900">Cancel</Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Product Name</label>
                        <input
                            type="text"
                            required
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 p-2 border"
                            value={formData.productName}
                            onChange={e => setFormData({ ...formData, productName: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <select
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 p-2 border"
                            value={formData.productCategory}
                            onChange={e => setFormData({ ...formData, productCategory: e.target.value })}
                        >
                            <option value="men">Men</option>
                            <option value="women">Women</option>
                            <option value="children">Children</option>
                            <option value="unisex">Unisex</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Type</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Shirt, Pant, Kurta"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 p-2 border"
                            value={formData.productType}
                            onChange={e => setFormData({ ...formData, productType: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Material</label>
                        <input
                            type="text"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 p-2 border"
                            value={formData.material}
                            onChange={e => setFormData({ ...formData, material: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Sales Price (₹)</label>
                        <input
                            type="number"
                            required
                            min="0"
                            step="0.01"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 p-2 border"
                            value={formData.salesPrice}
                            onChange={e => setFormData({ ...formData, salesPrice: parseFloat(e.target.value) })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Current Stock</label>
                        <input
                            type="number"
                            required
                            min="0"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 p-2 border"
                            value={formData.currentStock}
                            onChange={e => setFormData({ ...formData, currentStock: parseInt(e.target.value) })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Purchase Price (₹)</label>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 p-2 border"
                            value={formData.purchasePrice}
                            onChange={e => setFormData({ ...formData, purchasePrice: parseFloat(e.target.value) })}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        rows={3}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 p-2 border"
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>

                {/* Image Upload Section */}
                <div className="border-t pt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>

                    {/* Existing Images Display */}
                    {formData.images.length > 0 && (
                        <div className="flex gap-4 mb-4 flex-wrap">
                            {formData.images.map((img, idx) => (
                                <div key={idx} className="relative w-24 h-24 border rounded overflow-hidden">
                                    <img src={img} alt="product" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="mt-2">
                        <label className="block text-sm text-gray-600 mb-1">Upload New Images</label>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                        />
                        <p className="text-xs text-gray-500 mt-1">Select one or more images (JPG, PNG, WEBP)</p>
                    </div>
                </div>

                <div className="flex items-center">
                    <input
                        id="published"
                        type="checkbox"
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                        checked={formData.published}
                        onChange={e => setFormData({ ...formData, published: e.target.checked })}
                    />
                    <label htmlFor="published" className="ml-2 block text-sm text-gray-900">
                        Published on Website
                    </label>
                </div>

                <div className="flex justify-end pt-5">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : 'Save Product'}
                    </button>
                </div>
            </form>
        </div>
    )
}
