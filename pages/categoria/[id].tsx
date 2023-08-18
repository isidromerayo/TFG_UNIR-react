import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'

const Categoria: NextPage = () => {

  const router = useRouter()
  
  return (
    <>
      <div className="container pagina-datos">
      {router.query.id}
        <h1>Categoria <span className="destacar-palabra"> categoria.nombre</span>, sus cursos...</h1>
        <div>

          <section className="listado-categorias">
            <div>
              <h2> curso.titulo </h2>
            </div>
            <div>
              Valoración media:  curso.valoracionMedia / precio: curso.precio
            </div>
            <div>
              <Link href="#">{/* `/curso/${curso.id}` */}<span>detalle del curso</span><i
                className="bi bi-arrow-right"></i></Link>
            </div>
          </section>
        </div>
        <div className="sin-resultados">
          Sin cursos en esta categoría
        </div>
      </div>
    </>
  )
}

export default Categoria