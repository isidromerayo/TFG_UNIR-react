import { useState, useEffect } from 'react'
import { NextPage } from 'next'
import { getToken, getUser } from '../services'

const MisDatos: NextPage = () => {

    const [usuario, setUsuario] = useState<any>(null)
 
  useEffect(() => {
    setUsuario(getUser())
  }, [])

    return (
        <>
            {usuario ? 
            <div className="pagina-datos container">
                <h1>Mis Datos</h1>
                <section className="detalle-curso">
                <p>{ usuario.fullname }</p>
                <p>{ usuario.username }</p>
                </section>
            </div>
            : '' }
        </>
    )
}

export async function getServerSideProps({ req, res }:{ req:any, res:any }) {
  const token = getToken();
  if (!token) {
    res.writeHead(307, { Location: "/acceso" });
    res.end();
  }
  return { props: {} };

}

export default MisDatos