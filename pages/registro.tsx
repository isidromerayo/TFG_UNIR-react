import { NextPage } from 'next'
import Link from 'next/link'

const Registro: NextPage = () => {
  return (
      <div className="container pagina-datos">
        <div className="col-lg-8">
          <form name="registro" className="signup-form">
            <h1 className="title">Registro de usuario</h1>
          </form>
        </div>
      </div>

  )
}
export default Registro