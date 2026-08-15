import { useState, useEffect } from 'react'
import { NextPage } from 'next'
import { getToken, getUser } from '../services';
import { Usuario, Curso, ApiError, NextRequestResponse } from '../types';
import api from '../utils/api';
import { logger } from '../utils/logger';

const MisCursos: NextPage = () => {
    const [cursos, setCursos] = useState<Curso[]>([]);

    useEffect(() => {
        const usuario: Usuario | null = getUser();
        if (!usuario?.id) {
            return;
        }

        api.get(`/usuarios/${usuario.id}/cursos`, {
            headers: {
                'Accept': 'application/json, application/hal+json',
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            const embedded = response.data?._embedded?.cursos;
            if (Array.isArray(embedded)) {
                setCursos(embedded);
            } else if (Array.isArray(response.data)) {
                setCursos(response.data);
            } else {
                setCursos([]);
            }
        }).catch((error) => {
            const apiError = error as ApiError;
            logger.error('Error al cargar los cursos matriculados:', {
                message: apiError.message,
                status: apiError.response?.status,
                data: apiError.response?.data
            });
            setCursos([]);
        });
    }, []);

    return (
        <div className="pagina-datos container">
            <h1>Mis cursos</h1>
            {cursos.length > 0 ? (
                <section className="detalle-curso card">
                    {cursos.map((curso) => (
                        <div key={curso.id}>
                            <h2>{curso.titulo}</h2>
                            <p>{curso.descripcion}</p>
                        </div>
                    ))}
                </section>
            ) : (
                <p>No tienes cursos matriculados.</p>
            )}
        </div>
    )
}

export function getServerSideProps({ res }: NextRequestResponse) {
    const token = getToken();
    if (!token) {
      res.writeHead(307, { Location: "/acceso" });
      res.end();
    }
    return { props: {} };
  
  }

export default MisCursos
