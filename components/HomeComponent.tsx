import Link from "next/link";


export default function HomeComponent({ data }) {
    const { cursos_mas_valorados, valoraciones_cursos, cursos_actualizados } = data;

    return (
        <>
            <section className="featured-services portada-cards">
                <div className="container">

                    <div className="row gy-4 cursos-destacados">
                        <div>
                            <h1>Cursos destacados</h1>
                        </div>
                        {
                            cursos_mas_valorados.map((datos: any) => (
                                <div className="col-lg-4 col-md-6 service-item d-flex" key={datos.id}>
                                    <div>
                                        <h4>{datos.titulo}</h4>
                                        <p className="description">{datos.descripcion}</p>
                                        <p className="description">valoración media: <b>{datos.valoracionMedia}/5</b> / actualizado: {
                                            datos.fechaActualizacion}</p>
                                        <Link href={`/curso/${datos.id}`} className="">
                                            <span>Detalle</span><i className="bi bi-arrow-right"></i>
                                        </Link>
                                    </div>
                                </div>
                            ))
                        }

                    </div>

                </div>
            </section>

            <section className="featured-services portada-cards">
                <div className="container">

                    <div className="row gy-4 cursos-opiniones">
                        <div>
                            <h1>Opiniones</h1>
                        </div>
                        {
                            valoraciones_cursos.map((datos: any) => (
                                <div className="col-lg-4 col-md-6 service-item d-flex" key={datos.id}>
                                    <div>
                                        <p className="description">Valoración: <b>{datos.puntuacion}/5</b></p>
                                        <p className="description">{datos.comentario}</p>
                                        <Link href={`/valoracion/${datos.id}`} className="">
                                            <span>Detalle</span><i className="bi bi-arrow-right">
                                            </i></Link>
                                    </div>
                                </div>
                            ))
                        }

                    </div>
                </div>
            </section>

            <section className="featured-services portada-cards">
                <div className="container">

                    <div className="row gy-4 cursos-actualizaciones">
                        <div>
                            <h1>Ultimas actualizaciones</h1>
                        </div>

                        {
                            cursos_actualizados.map((datos: any) => (
                                <div className="col-lg-4 col-md-6 service-item d-flex" key={datos.id}>
                                    <div>
                                        <h4 className="title">{datos.titulo} </h4>
                                        <p className="description">{datos.descripcion}</p>
                                        <Link href={`/curso/${datos.id}`} className="">
                                            <span>Detalle</span><i className="bi bi-arrow-right"></i>
                                        </Link>
                                    </div>
                                </div>
                            ))
                        }


                    </div>
                </div>
            </section>
        </>
    )
}

