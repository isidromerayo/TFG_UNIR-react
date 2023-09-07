import { create } from "zustand"

interface State {
    cart: any[]
    totalPrice: number
   }

interface Actions {
    addToCart: (item: any) => void
    removeFromCart: (item: any) => void
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
    addToCart: (product: any) => {
     const cart = get().cart
     const cartItem = cart.find((item:any) => item.id === product.id)
   
     if (cartItem) {
   
     } else {
      const updatedCart = [...cart, { ...product, quantity: 1 }]
   
      set(state => ({
       cart: updatedCart,
       totalPrice: state.totalPrice + product.precio,
      }))
     }
    },
    removeFromCart: (product: any) => {
     set(state => ({
      cart: state.cart.filter((item:any) => item.id !== product.id),
      totalPrice: state.totalPrice - product.precio,
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