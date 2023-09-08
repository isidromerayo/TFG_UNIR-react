import { NextPage } from 'next'
import Link from 'next/link'
import { API_URL } from '../utils'
import { useState, useEffect } from 'react';
import axios from 'axios';

const Categorias: NextPage = () => {


  const [categorias, setCategorias] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      const result_cursos = await axios(`${API_URL}categorias?sort=nombre`)
      setCategorias(result_cursos.data._embedded.categorias)
      setLoading(false);
    }
    fetchData()
  }, [])

  return loading ? (
    <div>...Data Loading.....</div>
  ) : (
    <div className="container pagina-datos">
      <h1>Categorias de nuestros cursos</h1>
      
      {
        categorias.map((categoria) => (
      <section className="listado-categorias" key={categoria.id}>
        <div>
          <h2>{categoria.nombre}</h2>
        </div>
        <div>
          {categoria.descripcion}
          <Link href={`/categoria/${categoria.id}`}><span>ver cursos</span><i
            className="bi bi-arrow-right"></i></Link>
        </div>
      </section>
 ))
}
    </div>

  )
}

export default Categorias