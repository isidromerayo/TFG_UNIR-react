import { useState, useEffect } from 'react'
import { NextPage } from 'next'
import { getToken, getUser } from '../services'

const MisDatos: NextPage = () => {

    const [user, setUser] = useState(false)
 
  useEffect(() => {
    setUser(JSON.parse(getUser()))
  }, [])

    return (
        <>
            {user ? 
            <div className="pagina-datos container">
                <h1>Mis Datos</h1>
                <section className="detalle-curso">
                <p>{ user.fullname }</p>
                <p>{ user.username }</p>
                </section>
            </div>
            : '' }
        </>
    )
}

export async function getServerSideProps({ req, res }) {
  const token = getToken();
  if (!token) {
    res.writeHead(307, { Location: "/acceso" });
    res.end();
  }
  return { props: {} };

}

export default MisDatos