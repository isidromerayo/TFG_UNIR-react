import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { API_URL } from '../../utils'
import axios from 'axios'

function Categoria({ data }: { data: any} ) {

  const router = useRouter()
  const [cursos, setCursos] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchData = async (categoria_id: number) => {
      const result_cursos = await axios(`${API_URL}/categorias/${categoria_id}/cursos`)
      setCursos(result_cursos.data._embedded.cursos)
      setLoading(false)
    }
    fetchData(data.id)
  }, [data.id, router.isReady])
  return loading ? (
    <div>...Data Loading.....</div>
  ) : (

      <div className="container pagina-datos">
        <h1>Categoria <span className="destacar-palabra"> {data.nombre}</span>, sus cursos...</h1>
        <div>
          {cursos.length == 0 ? (<div className="sin-resultados">
            Sin cursos en esta categoría
          </div>) : ''}

          {cursos.map(curso => (
            <section className="listado-categorias" key={curso.id}>
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
  )
}

// This gets called on every request
export async function getServerSideProps({query}:{query:any}) {
  // Fetch data from external API - change any to the type of data you are fetching
  const categoria_id = parseInt(query.id, 10);
  if (isNaN(categoria_id)) {
    return { notFound: true };
  }
  const res = await fetch(`${API_URL}/categorias/${categoria_id}`)
  const data = await res.json()
 
  // Pass data to the page via props
  return { props: { data } }
}
 

export default Categoria