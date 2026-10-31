import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { API_URL } from '../../utils'
import api from '../../utils/api'
import { Categoria as CategoriaType, Curso, NextPageContext, ApiError, CursoEmbedded } from '../../types'
import { logger } from '../../utils/logger'

function Categoria({ data }: { data: CategoriaType }) {

  const router = useRouter()
  const [cursos, setCursos] = useState<Curso[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchData = async (categoria_id: number) => {
      try {
        const response = await api.get<Partial<CursoEmbedded>>(`${API_URL}/categorias/${categoria_id}/cursos`)
        const cursosDeCategoria = response.data._embedded?.cursos
        setCursos(Array.isArray(cursosDeCategoria) ? cursosDeCategoria : [])
      } catch (error) {
        const apiError = error as ApiError
        logger.error('Error al cargar los cursos de la categoría:', {
          message: apiError.message,
          status: apiError.response?.status
        })
        setCursos([])
      } finally {
        setLoading(false)
      }
    }
    void fetchData(data.id)
  }, [data.id, router.isReady])
  return loading ? (
    <div>...Data Loading.....</div>
  ) : (

    <div className="container pagina-datos">
      <h1>Categoria <span className="destacar-palabra"> {data.nombre}</span>, sus cursos...</h1>
      <div>
        {cursos.length === 0 ? (<div className="sin-resultados">
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
export async function getServerSideProps({ query }: NextPageContext) {
  const categoria_id = query.id ? Number.parseInt(query.id, 10) : Number.NaN;
  if (!query.id || Number.isNaN(categoria_id)) {
    return { notFound: true };
  }
  const res = await fetch(`${API_URL}/categorias/${categoria_id}`)
  const data = await res.json()

  // Pass data to the page via props
  return { props: { data } }
}


export default Categoria