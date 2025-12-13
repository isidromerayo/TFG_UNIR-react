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
     const quantity = cartItem?.quantity || 1;
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