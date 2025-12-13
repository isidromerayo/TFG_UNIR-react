import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from 'next/router';

import Swal from 'sweetalert2';
import { removeToken, getToken, removeUser } from '../services'

import api from '../utils/api';
import MenuCategoriaComponent from "./MenuCategoriaComponent";
import Image from 'next/image';
import { Categoria, ApiError } from '../types';
import { logger } from '../utils/logger';

export default function HeaderComponent() {
    const { push } = useRouter();

    const [data, setData] = useState<Categoria[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await api.get('categorias', {
                    params: {
                        sort: 'nombre',
                        size: 5
                    },
                    headers: {
                        'Accept': 'application/json, application/hal+json',
                        'Content-Type': 'application/json'
                    }
                });
                
                // Check if we have a valid response with categories
                const categories = response.data?._embedded?.categorias;
                if (Array.isArray(categories)) {
                    setData(categories);
                } else {
                    logger.warn('No categories found in response:', response.data);
                    setData([]);
                }
            } catch (error) {
                const apiError = error as ApiError;
                logger.error('Failed to fetch categories:', {
                    message: apiError.message,
                    status: apiError.response?.status,
                    data: apiError.response?.data
                });
                setData([]);
                // Show error message to user
                const errorMessage = apiError.response?.status === 404
                    ? 'No se encontraron categorías'
                    : 'Error al cargar las categorías. Por favor, inténtelo de nuevo más tarde.';
                logger.error(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // Cleanup function
        return () => {
            setData([]);
            setLoading(false);
        };
    }, [])

    let isLogin = false;

    isLogin = (getToken() === null) ? false : true

    function logout() {
        removeToken()
        removeUser()
        isLogin = false
        Swal.fire('Acceso', 'Cierre de sesion correcta');
        push('/')
    }

    return loading ? (
        <div>...Data Loading.....</div>
      ) : (
        <>
    <header id="header" className="header d-flex align-items-center fixed-top color-react-azulclaro">
        <div className="container-fluid container-xl d-flex align-items-center justify-content-between">
            
                    <Link href="/" className="logo d-flex align-items-center fix-home-menu">
                        <Image src="/react.svg" alt="Logo React" className="unir-logo" width={40} height={40} />
                        <Image src="/assets/img/Unir_2021_logo.svg" alt="Logo UNIR" className="unir-logo" width={100} height={40} />
                        <h1>TFG - FFJ: AEP</h1>
                    </Link>

                    <i className="mobile-nav-toggle mobile-nav-show bi bi-list"></i>
                    <i className="mobile-nav-toggle mobile-nav-hide d-none bi bi-x"></i>
                    <nav id="navbar" className="navbar">
                        <ul>
                            <li><Link href="/" className="active">Home</Link></li>
                            <li className="dropdown"><Link href="/categorias"><span>Categorias</span><i className="bi bi-chevron-down dropdown-indicator"></i></Link>
                                <ul>
                                    <MenuCategoriaComponent data={data}/>
                                    <li><Link href="/categorias">...</Link></li>
                                </ul>

                            </li>
                            <li><Link href="/carrito" title="carrito de la compra"><i className="bi bi-cart4" title="carito de la compra" aria-hidden="true"> carrito</i></Link></li>
                            {isLogin ? (
                                <>
                                    <li className="dropdown">
                                        <Link href="/mis-datos" active-class="active">
                                            <span><i className="bi bi-file-person iconos-menu"> Privado</i></span>
                                            <i className="bi bi-chevron-down dropdown-indicator"></i></Link>
                                        <ul>
                                            <li><Link href="/mis-datos">Mis datos</Link></li>
                                            <li><Link href="/mis-cursos">Mis cursos</Link></li>
                                            <li><Link href="#" onClick={(e) => {
                                                e.preventDefault();
                                                logout();
                                            }}>desconectar</Link></li>
                                        </ul>
                                    </li>

                                </>

                            ) : (
                                <>
                                    <li><Link href="/registro">Registro</Link></li>
                                    <li><Link href="/acceso" className="get-a-quote">Acceso</Link></li>
                                </>
                            )}

                        </ul>
                    </nav>
                </div>
            </header>
        </>
    )
}
