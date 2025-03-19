import { API_URL } from '../../utils'
import Link from 'next/link';

function Valoracion({ data }: {readonly data: any; }) {

  const { valoracion, curso, alumno } = data;

  return (

      <div className="container pagina-datos">
        <h1>Opinión</h1>
        <section className="detalle_opinion">
          <div className="datos-alumno">
            {alumno.nombre} {alumno.apellidos}
          </div>
          <div className="info-valoracion">
            Valoración <span className="valoracion-puntos">{valoracion.puntuacion}/5</span> / Fecha <span className="fecha">{valoracion.fecha}</span>
          </div>
          <div className="info-comentario">
            {valoracion.comentario}
          </div>
          <div className="info-curso">

            Curso de <Link href={`/curso/${curso.id}`} className="">
              <span className="">{curso.titulo}</span>
            </Link> actualizado <span className="">{curso.fechaActualizacion}</span> valoración media <span className="destacar-info">{curso.valoracionMedia}</span>,
            profesor/a <span>
              {curso.instructor.nombre + ' ' + curso.instructor.apellidos}</span>
          </div>
        </section>

      </div>
  );
}

export async function getServerSideProps({ query }:{query:any}) {
  const id = query.id;

  const res = await fetch(`${API_URL}valoraciones/${id}`)
  const valoracion = await res.json()
  const res2 = await fetch(`${API_URL}valoraciones/${id}/curso`)
  const curso = await res2.json()
  const res3 = await fetch(`${API_URL}valoraciones/${id}/estudiante`)
  const alumno = await res3.json()
  const data:any = { valoracion: valoracion, curso: curso, alumno: alumno }

  return { props: {data} }
}


export default Valoracion