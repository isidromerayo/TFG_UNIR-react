import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { API_URL } from '../../utils';
import type { Curso } from '../../types';
import { CartItem } from '../../types';
import Swal from 'sweetalert2';
import { useCartStore } from '../../store/useCartStore';
import type { NextPageContext } from '../../types';

function Curso({ data }: { data: Curso }) {
  const [loading, setLoading] = useState<boolean>(true);
  const addToCart = useCartStore(state => state.addToCart);

  useEffect(() => {
    setLoading(false);
  }, []);

  const addCursoCarrito = () => {
    if (data) {
      const cartItem: CartItem = {
        id: data.id,
        titulo: data.titulo,
        precio: data.precio,
        quantity: 1,
        descripcion: data.descripcion,
        valoracionMedia: data.valoracionMedia,
        fechaCreacion: data.fechaCreacion,
        fechaActualizacion: data.fechaActualizacion
      };
      addToCart(cartItem);
      Swal.fire('Carrito', 'Curso añadido al carrito', 'success');
    }
  };

  if (loading) {
    return <div>...Data Loading.....</div>;
  }

  return (
    <div className="container pagina-datos">
      <h1>{data.titulo}</h1>
      <section className="detalle-curso">
        <p>{data.descripcion}</p>
        <p className="description">Valoración: <b>{data.valoracionMedia}/5</b></p>
        <p className="description">Precio {data.precio}</p>
        <p className="descripcion">
          Creado: {data.fechaCreacion} / actualizado: {data.fechaActualizacion}
        </p>
        {data.instructor && (
          <p className="info-instructor">
            Profesor/a <span>
              {data.instructor.nombre} {data.instructor.apellidos}
            </span>
            {data.instructor.descripcion && ` "${data.instructor.descripcion}"`}
          </p>
        )}
        <p>
          <button 
            type="button" 
            className="btn btn-primary borrar-form" 
            onClick={addCursoCarrito}
          >
            Comprar curso
          </button>
        </p>
      </section>
    </div>
  );
}

export async function getServerSideProps({ query }: NextPageContext) {
  const curso_id = query.id;
  if (!curso_id || !/^\d+$/.test(curso_id)) {
    return { notFound: true };
  }
  const res = await fetch(`${API_URL}/cursos/${curso_id}`)
  const data = await res.json()

  return { props: { data } }
}

export default Curso