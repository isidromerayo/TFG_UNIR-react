import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { API_URL } from '../../utils';
import type { Curso } from '../../types';
import { CartItem } from '../../types';
import Swal from 'sweetalert2';
import { useCartStore } from '../../store/useCartStore';
import { logger } from '../../utils/logger';

export default function CursoPage() {
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState<Curso | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const addToCart = useCartStore(state => state.addToCart);

  useEffect(() => {
    if (id && typeof id === 'string' && /^\d+$/.test(id)) {
      const sanitizedId = Number.parseInt(id, 10);
      const fetchData = async () => {
        try {
          const res = await fetch(`${API_URL}/cursos/${sanitizedId}`);
          if (res.ok) {
            const cursoData = await res.json();
            setData(cursoData);
          }
        } catch (error) {
          logger.error('Error fetching curso:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    } else {
      setLoading(false);
    }
  }, [id]);

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

  if (!data) {
    return <div>Curso no encontrado</div>;
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