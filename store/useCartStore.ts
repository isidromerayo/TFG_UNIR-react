import { create } from "zustand"
import { CartItem } from '../types'

interface State {
    cart: CartItem[]
    totalPrice: number
   }

interface Actions {
    addToCart: (item: CartItem) => void
    removeFromCart: (item: CartItem) => void
    clearCart: () => void
   }

const INITIAL_STATE: State = {
    cart: [],
    totalPrice: 0,
   }

// Create the store with Zustand, combining the status interface and actions
export const useCartStore = create<State & Actions>((set, get) => ({
    cart: INITIAL_STATE.cart,
    totalPrice: INITIAL_STATE.totalPrice,
    addToCart: (product: CartItem) => {
     const cart = get().cart
     const cartItem = cart.find((item: CartItem) => item.id === product.id)
   
     if (cartItem) {
      // Increment quantity if product already exists in cart
      const updatedCart = cart.map((item: CartItem) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
      
      set(state => ({
        cart: updatedCart,
        totalPrice: state.totalPrice + product.precio,
      }))
     } else {
      const updatedCart = [...cart, { ...product, quantity: 1 }]
   
      set(state => ({
       cart: updatedCart,
       totalPrice: state.totalPrice + product.precio,
      }))
     }
    },
    removeFromCart: (product: CartItem) => {
     const cartItem = get().cart.find((item: CartItem) => item.id === product.id);
     if (!cartItem) {
       // Producto no está en el carrito, no hacer nada
       return;
     }
     const quantity = cartItem.quantity;
     set(state => ({
      cart: state.cart.filter((item: CartItem) => item.id !== product.id),
      totalPrice: state.totalPrice - (product.precio * quantity),
     }))
    },
    clearCart: () => {
        set(
            state => ({
                cart: [],
                totalPrice: 0
            })
        )
    }
   }))