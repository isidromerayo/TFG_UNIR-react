import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { API_URL } from '../../utils'
import axios from 'axios'

const Categoria: NextPage = ({data}) => {

  console.log(data)
  const router = useRouter()
  const [cursos, setCursos] = useState(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async (categoria_id: number) => {
        const result_cursos = await axios(`${API_URL}categorias/${categoria_id}/cursos`)
        setCursos(result_cursos.data._embedded.cursos)
        setLoading(false);
    }
    fetchData(data.id)
}, [data.id, router.isReady])
  return loading ? (
    <div>...Data Loading.....</div>
  ) : (

    <>
      <div className="container pagina-datos">
        <h1>Categoria <span className="destacar-palabra"> {data.nombre}</span>, sus cursos...</h1>
        <div>
          {cursos.length == 0 ? (<div className="sin-resultados">
            Sin cursos en esta categoría
            </div>) : ''}
  
        {cursos.map(curso => (
          <section className="listado-categorias">
            <div>
              <h2> {curso.titulo} </h2>
            </div>
            <div>
              Valoración media:  {curso.valoracionMedia} / precio: {curso.precio}
            </div>
            <div>
              <Link href={`/curso/${curso.id}`}><span>detalle del curso</span><i
                className="bi bi-arrow-right"></i></Link>
            </div>
          </section>
        ))}
        </div>
       
      </div>
    </>
  )
}

// This gets called on every request
export async function getServerSideProps({query}) {
  // Fetch data from external API
  console.log(query.id)
  const categoria_id = query.id;
  const res = await fetch(`${API_URL}categorias/${categoria_id}`)
  const data = await res.json()
 
  // Pass data to the page via props
  return { props: { data } }
}
 

export default Categoria