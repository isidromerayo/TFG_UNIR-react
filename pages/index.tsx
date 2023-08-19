import { NextPage } from 'next'
import SliderComponent from '../components/SliderComponent'
import HomeComponent from '../components/HomeComponent'
import { API_URL } from '../utils'
import axios from 'axios'
import { useEffect, useState } from 'react'

const Home: NextPage = () => {
  

  const [valorados, setValorados] = useState(null);
  const [valoraciones, setValoraciones] = useState(null);
  const [actualizados, setActualizados] = useState(null);
  const [loading, setLoading] = useState<boolean>(true);


  useEffect(() => {
    const url_cursos = `${API_URL}cursos/search/selectMorePoints`;
  // response.data._embedded.cursos
  const url_valoraciones = `${API_URL}valoraciones/search/selectLastOpinions`;
  //response.data._embedded.valoraciones
  const url_actualizaciones = `${API_URL}cursos/search/selectLastUpdates`;
  //response.data._embedded.cursos;
    const fetchData = async () => {
      const result_cursos = await axios(url_cursos)
      setValorados(result_cursos.data._embedded.cursos)
      const result_valoraciones = await axios(url_valoraciones)
      setValoraciones(result_valoraciones.data._embedded.valoraciones)
      const result_actualizaciones = await axios(url_actualizaciones)
      setActualizados(result_actualizaciones.data._embedded.cursos)

      setLoading(false);
    }
    fetchData()
  }, [])
  
    //const { cursos_mas_valorados, valoraciones_cursos, cursos_actualizados } = data; 
    const data: any = {cursos_mas_valorados: valorados, valoraciones_cursos:valoraciones, cursos_actualizados:actualizados};

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