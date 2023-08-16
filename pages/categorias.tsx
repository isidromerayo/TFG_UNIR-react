import { NextPage } from 'next'
import Link from 'next/link'

const Categorias: NextPage = () => {
  return (
    <div className="container pagina-datos">
      <h1>Categorias de nuestros cursos</h1>
      <section className="listado-categorias"  >
        <div>
          <h2>categoria.nombre</h2>
        </div>
        <div>
          categoria.descripcion
          <Link href="/categoria/id"><span>ver cursos</span><i 
                    className="bi bi-arrow-right"></i></Link>
          {/* <RouterLink :to="`/categoria/${categoria.id}`"></RouterLink>*/}
        </div>
      </section>

    </div>

  )
}

export default Categorias