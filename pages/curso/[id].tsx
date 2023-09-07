import { useEffect, useState } from 'react';
import { NextPage } from 'next'
import { API_URL } from '../../utils'
import Swal from 'sweetalert2';
import { useCartStore } from '../../store/useCartStore';

function Curso({ data }: { data: any; }) {

  const curso = data;
  const [loading, setLoading] = useState<boolean>(true);
  const addToCart = useCartStore(state => state.addToCart);

  useEffect(() => {
    setLoading(false);

  }, []);

  const addCursoCarrito = () => {
    addToCart(curso);
    Swal.fire({ title: 'Curso añadido al carrito' });
  };

  return loading ? (
    <div>...Data Loading.....</div>
  ) : (

    <>
      <div className="container pagina-datos">
        <h1>{curso.titulo}</h1>
        <section className="detalle-curso">
          <p>{curso.descripcion}</p>
          <p className="description">Valoración: <b>{curso.valoracionMedia}/5</b></p>
          <p className="description">Precio {curso.precio} </p>
          <p className="descripcion">Creado: {curso.fechaCreacion}/ actualizado: {curso.fechaActualizacion}</p>
          {curso.instructo ? (
            <p className="info-instructor">Instructor: {curso.instructor.nombre} {curso.instructor.apellidos} <i>"{curso.instructor.descripcion}"</i></p>
          ) : ''}
          <p><button type="button" className="btn btn-primary borrar-form" onClick={addCursoCarrito}>Comprar curso</button></p>

        </section>

      </div>
    </>
  );
}

export async function getServerSideProps({ query }:{query:any}) {
  const curso_id = query.id;
  const res = await fetch(`${API_URL}cursos/${curso_id}`)
  const data = await res.json()

  return { props: { data } }
}

export default Curso