import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { API_URL } from '../../utils'
import axios from 'axios'

const Curso: NextPage = ({ data }) => {

  console.log(data)
  const curso = data;
  const router = useRouter()
  /*
  const [cursos, setCursos] = useState(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async (categoria_id: number) => {
        const result_cursos = await axios(`${API_URL}categorias/${categoria_id}/cursos`)
        setCursos(result_cursos.data._embedded.cursos)
        setLoading(false);
    }
    fetchData(data.id)
}, [data.id, router.isReady])*/
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
          <p><button type="button" className="btn btn-primary borrar-form">Comprar curso</button></p>

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