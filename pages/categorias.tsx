import { NextPage } from 'next'
import Link from 'next/link'
import { API_URL } from '../utils'
import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Categoria, ApiError } from '../types';
import { logger } from '../utils/logger';

const Categorias: NextPage = () => {


  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api(`${API_URL}/categorias?sort=nombre`);
        const categoriasEncontradas = response.data?._embedded?.categorias;
        setCategorias(Array.isArray(categoriasEncontradas) ? categoriasEncontradas : []);
      } catch (error) {
        const apiError = error as ApiError;
        logger.error('Error al cargar las categorías:', {
          message: apiError.message,
          status: apiError.response?.status
        });
        setCategorias([]);
      } finally {
        setLoading(false);
      }
    }
    void fetchData()
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