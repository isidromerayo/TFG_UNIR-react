import { API_URL } from "../../utils";
import { useEffect, useState } from "react";
import api from "../../utils/api";
import Link from "next/link";
import { Curso, NextPageContext, ApiError, CursoEmbedded } from '../../types';
import { logger } from '../../utils/logger';

function Busqueda({ query_string }: { query_string: string; }) {

    const [cursos, setCursos] = useState<Curso[] | undefined>();
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async (query: string) => {
            try {
                const encodedQuery = encodeURIComponent(query);
                const response = await api.get<Partial<CursoEmbedded>>(`${API_URL}/cursos/search/findByTituloContaining?titulo=${encodedQuery}`);
                const cursosEncontrados = response.data._embedded?.cursos;
                setCursos(Array.isArray(cursosEncontrados) ? cursosEncontrados : []);
            } catch (error) {
                const apiError = error as ApiError;
                logger.error('Error al buscar cursos:', {
                    message: apiError.message,
                    status: apiError.response?.status
                });
                setCursos([]);
            } finally {
                setLoading(false);
            }
        };
        void fetchData(query_string);
    }, [query_string]);

    return loading ? (
        <div>...Data Loading.....</div>
    ) : (
        <div className="container pagina-datos">
            <h1>Búsqueda de nuestros cursos: <span className="destacar-palabra">{query_string}</span></h1>
            {!cursos || cursos.length === 0 ? (<div className="sin-resultados">
                No hay resultados para el texto indicado, revise o refine la palabra de búsqueda...
                <p>
                    <Link href="/">volver al inicio</Link>
                </p>
            </div>) : ''}
            {/* iterar */}
            {cursos ?
                cursos.map((curso: Curso) => (
                    <section className="listado-categorias" key={curso.id}>
                        <div>
                            <h2>{curso.titulo}</h2>
                        </div>
                        <div>
                            {curso.descripcion} <Link href={`/curso/${curso.id}`}><span>detalle del curso</span><i className="bi bi-arrow-right"></i>
                            </Link>
                        </div>
                    </section>
                ))
                : ''}

        </div>
    );
}

export function getServerSideProps({ query }: NextPageContext) {
    const query_string = query.query;
    if (!query_string || typeof query_string !== 'string') {
        return { notFound: true };
    }
    return { props: { query_string } }
}

export default Busqueda