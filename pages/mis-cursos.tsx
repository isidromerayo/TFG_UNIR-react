
import { NextPage } from 'next'
import { getToken } from '../services';
import { NextRequestResponse } from '../types';

const MisCursos: NextPage = () => {

    return (
            <div className="pagina-datos container">
                <h1>Mis cursos</h1>
                <section className="detalle-curso card">

                </section>
            </div>
    )
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getServerSideProps({ req: _req, res }: NextRequestResponse) {
    const token = getToken();
    if (!token) {
      res.writeHead(307, { Location: "/acceso" });
      res.end();
    }
    return { props: {} };
  
  }

export default MisCursos