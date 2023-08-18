
import { NextPage } from 'next'
import { getUser } from '../services'

const MisDatos: NextPage = () => {

    return (
        <>
            <div className="pagina-datos container">
                <h1>Mis Datos</h1>
                <section className="detalle-curso">
                <pre>{ getUser() }</pre>
                </section>
            </div>
        </>
    )
}

export default MisDatos