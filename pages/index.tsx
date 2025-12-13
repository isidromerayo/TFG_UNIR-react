import { NextPage } from 'next'
import SliderComponent from '../components/SliderComponent'
import HomeComponent from '../components/HomeComponent'
import { API_URL } from '../utils'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Curso, Valoracion, HomePageData } from '../types'
import { logger } from '../utils/logger'

const Home: NextPage = () => {
  

  const [valorados, setValorados] = useState<Curso[]>([]);
  const [valoraciones, setValoraciones] = useState<Valoracion[]>([]);
  const [actualizados, setActualizados] = useState<Curso[]>([]);
  const [loading, setLoading] = useState<boolean>(true);


  useEffect(() => {
    const url_cursos = `${API_URL}/cursos/search/selectMorePoints`;
    const url_valoraciones = `${API_URL}/valoraciones/search/selectLastOpinions`;
    const url_actualizaciones = `${API_URL}/cursos/search/selectLastUpdates`;

    const fetchData = async () => {
      try {
        const [result_cursos, result_valoraciones, result_actualizaciones] = await Promise.all([
          axios.get(url_cursos),
          axios.get(url_valoraciones),
          axios.get(url_actualizaciones)
        ]);

        setValorados(result_cursos.data._embedded?.cursos || []);
        setValoraciones(result_valoraciones.data._embedded?.valoraciones || []);
        setActualizados(result_actualizaciones.data._embedded?.cursos || []);
      } catch (error) {
        logger.error('Error fetching data:', error);
        // Set empty arrays as fallback
        setValorados([]);
        setValoraciones([]);
        setActualizados([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [])
  
    const data: HomePageData = {
      cursos_mas_valorados: valorados, 
      valoraciones_cursos: valoraciones, 
      cursos_actualizados: actualizados
    };

  return loading ? (
    <div>...Data Loading.....</div>
  ) : (
    <>
      <SliderComponent/>

      <HomeComponent data={data}></HomeComponent>
      </>
  )
}

export default Home