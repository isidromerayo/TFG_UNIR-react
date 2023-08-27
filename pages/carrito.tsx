import { useEffect, useState } from 'react';
import { NextPage } from 'next'
import { useCartStore } from '../store/useCartStore';
import { getToken } from '../services/session';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';

const Carrito: NextPage = () => {

    const [cartState, setCartState] = useState<any[]>([])
    const [loading, setLoading] = useState<boolean>(true);

    const router = useRouter()
    
    const cart = useCartStore(state => state.cart); 
    const totalCompra = cart.reduce((acc, product) => acc + product.precio * (product.quantity as number), 0);
    const removeFromCart = useCartStore(state => state.removeFromCart)
    const removeAllFromCart = useCartStore(state => state.clearCart)

    useEffect(() => {
        setCartState(cart)
        setLoading(false)
       }, [cart])

       const deleteCursoCarrito = (product:any):void => {
            removeFromCart(product)
       }

       const realizarCompra = ():void =>{
            if (!getToken()) {
            Swal.fire({ title: 'Debe tener iniciada sesión para comprar' })
            router.push("/acceso");
          }
          else {
            Swal.fire({
                title: '¿Estas seguro de realizar la compra?',
                text: "No se puede deshacer",
                showCancelButton: true
              }).then((result) => {
                if (result.isConfirmed) {
                  console.log("inicio de transacción de compra")
                  removeAllFromCart();
                  router.push("/mis-cursos");
                  Swal.fire('Compra','Procesada la compra correctamente');
                }
              }).catch((error) => {
                console.log(error)
              });
          }

       }

       return loading ? (
        <div>...Data Loading.....</div>
      ) : (
            <div className="pagina-datos container">
                <h1>Carrito</h1>
                <section className="detalle-curso">
                {cartState.length == 0 ?
                <div className="sin-resultados">No hay productos en el carrito</div>
                :
                (    
            <div>
            <h2>Cursos a comprar</h2>
            <ul>
            {cartState.map(product => (<li key={product.id}> {product.titulo} - {product.precio} 
            <button className="btn btn-warning borrar-curso-carrito" onClick={ () => deleteCursoCarrito(product)}>borrar</button></li>))}
            </ul>
        <div className="total-carrito">Total: <span className="destacar-info">{ totalCompra }</span></div>
        <div className="boton-comprar">
          <button className="btn btn-primary" onClick={realizarCompra}>comprar</button>

        </div>
      </div>
        )}
                </section>

            </div>
    )
}
export default Carrito