import { create } from 'zustand'

interface CartItem {
  productId: number
  productName: string
  price: number
  quantity: number
  image?: string
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('cart') || '[]') : [],
  addItem: (item) => {
    const items = get().items
    const existingItem = items.find((i) => i.productId === item.productId)
    
    let newItems
    if (existingItem) {
      newItems = items.map((i) =>
        i.productId === item.productId
          ? { ...i, quantity: i.quantity + item.quantity }
          : i
      )
    } else {
      newItems = [...items, item]
    }
    
    set({ items: newItems })
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(newItems))
    }
  },
  removeItem: (productId) => {
    const newItems = get().items.filter((i) => i.productId !== productId)
    set({ items: newItems })
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(newItems))
    }
  },
  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId)
    } else {
      const newItems = get().items.map((i) =>
        i.productId === productId ? { ...i, quantity } : i
      )
      set({ items: newItems })
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(newItems))
      }
    }
  },
  clearCart: () => {
    set({ items: [] })
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cart')
    }
  },
  getTotal: () => {
    return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  },
}))

