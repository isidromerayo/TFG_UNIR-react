import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { API_URL } from '../../utils'
import Swal from 'sweetalert2';

const Curso: NextPage = ({ data }) => {

  const curso = data;
  const router = useRouter()

  const addCursoCarrito = () => {
    console.log(curso.id + ' añadido al carrito')
    Swal.fire({ title: 'Curso añadido al carrito'} )
  } 

  return (

    <>
      <div className="container pagina-datos">
      <h1>{curso.titulo }</h1>
        <section className="detalle-curso">
          <p>{ curso.descripcion }</p>
          <p className="description">Valoración: <b>{ curso.valoracionMedia }/5</b></p>
          <p className="description">Precio { curso.precio } </p>
          <p className="descripcion">Creado: { curso.fechaCreacion }/ actualizado: { curso.fechaActualizacion }</p>
          <p v-if="curso.instructor" className="info-instructor">Instructor: { curso.instructor.nombre } {curso.instructor.apellidos } <i>"{ curso.instructor.descripcion }"</i></p>
          <p><button type="button" className="btn btn-primary borrar-form" onClick={addCursoCarrito}>Comprar curso</button></p>

        </section>

      </div>
    </>
  )
}

export async function getServerSideProps({ query }) {
  const curso_id = query.id;
  const res = await fetch(`${API_URL}cursos/${curso_id}`)
  const data = await res.json()

  return { props: { data } }
}


export default Curso