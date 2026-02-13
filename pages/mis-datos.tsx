import { useState, useEffect } from 'react'
import { NextPage } from 'next'
import { getToken, getUser } from '../services'
import { Usuario, NextRequestResponse } from '../types'

const MisDatos: NextPage = () => {

  const [usuario, setUsuario] = useState<Usuario | null>(null)

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


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getServerSideProps({ req: _req, res }: NextRequestResponse) {
  const token = getToken();
  if (!token) {
    res.writeHead(307, { Location: "/acceso" });
    res.end();
  }
  return { props: {} };

}

export default MisDatos