import axios from 'axios'
import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { API_URL } from '../../utils'

const Categoria: NextPage = () => {

  const router = useRouter()
  const [categoria, setData] = useState(null);
  const [cursos, setCursos] = useState(null);
  const [loading, setLoading] = useState<boolean>(true);
  const categoria_id: any = router.query.id;

  useEffect(() => {
    const fetchData = async (categoria_id: number) => {
        const result = await axios(`${API_URL}categorias/${categoria_id}`)
        const result_cursos = await axios(`${API_URL}categorias/${categoria_id}/cursos`)
        setData(result.data)
        setCursos(result_cursos.data._embedded.cursos)
        setLoading(false);
    }
    fetchData(categoria_id)
}, [])
  return loading ? (
    <div>...Data Loading.....</div>
  ) : (

    <>
      <div className="container pagina-datos">
        <h1>Categoria <span className="destacar-palabra"> {categoria.nombre}</span>, sus cursos...</h1>
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

export default Categoria