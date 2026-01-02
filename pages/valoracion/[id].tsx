import { API_URL } from '../../utils'
import Link from 'next/link';
import { Valoracion as ValoracionType, Curso, Usuario, NextPageContext } from '../../types';

interface ValoracionPageData {
  valoracion: ValoracionType;
  curso: Curso;
  alumno: Usuario;
}

function Valoracion({ data }: { readonly data: ValoracionPageData }) {

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
            {curso.instructor ? (
              `${curso.instructor.nombre} ${curso.instructor.apellidos}`
            ) : 'Instructor no disponible'}
          </span>
        </div>
      </section>

    </div>
  );
}

export async function getServerSideProps({ query }: NextPageContext) {
  const id = query.id;

  // Only allow numeric ids (update pattern as needed for your data model)
  if (!id || !/^\d+$/.test(id)) {
    // Optionally handle error, e.g., redirect, show empty data, or error page
    return { notFound: true };
  }

  const sanitizedId = parseInt(id as string, 10);

  const res = await fetch(`${API_URL}/valoraciones/${sanitizedId}`)
  const valoracion = await res.json()
  const res2 = await fetch(`${API_URL}/valoraciones/${sanitizedId}/curso`)
  const curso = await res2.json()
  const res3 = await fetch(`${API_URL}/valoraciones/${sanitizedId}/estudiante`)
  const alumno = await res3.json()
  const data: ValoracionPageData = { valoracion: valoracion, curso: curso, alumno: alumno }

  return { props: { data } }
}


export default Valoracion