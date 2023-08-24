import { useState, useEffect } from 'react'
import { NextPage } from 'next'
import { getUser } from '../services'

const MisDatos: NextPage = () => {

    const [user, setUser] = useState(false)
 
  useEffect(() => {
    setUser(JSON.parse(getUser()))
  }, [])

    return (
        <>
            <div className="pagina-datos container">
                <h1>Mis Datos</h1>
                <section className="detalle-curso">
                <p>{ user.fullname }</p>
                <p>{ user.username }</p>
                </section>
            </div>
        </>
    )
}

export default MisDatos