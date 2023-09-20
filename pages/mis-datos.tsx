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
          <h1>Mis datos</h1>
          <section className="detalle-curso card">
            <div className="perfil-datos">Nombre y apellidos</div>
            <div>{usuario.fullname}</div>
            <div className="perfil-datos">Correo electrónico</div>
            <div>{usuario.username}</div>
          </section>
        </div>
        : ''}
    </>
  )
}

export async function getServerSideProps({ req, res }: { req: any, res: any }) {
  const token = getToken();
  if (!token) {
    res.writeHead(307, { Location: "/acceso" });
    res.end();
  }
  return { props: {} };

}

export default MisDatos