import Image from 'next/image'
import styles from './page.module.css'

export default function Home() {
  return (
    <div>

      <header id="header" className="header d-flex align-items-center fixed-top color-react-azulclaro">
        <div className="container-fluid container-xl d-flex align-items-center justify-content-between">

          <a href="index.html" className="logo d-flex align-items-center">
            <img src="assets/img/Unir_2021_logo.svg" alt="Logo UNIR" className="unir-logo" />
            <h1>TFG - FFJ: AEP</h1>
          </a>

          <i className="mobile-nav-toggle mobile-nav-show bi bi-list"></i>
          <i className="mobile-nav-toggle mobile-nav-hide d-none bi bi-x"></i>
          <nav id="navbar" className="navbar">
            <ul>
              <li><a href="index.html" className="active">Home</a></li>
              <li className="dropdown"><a href="#"><span>Categorias</span><i className="bi bi-chevron-down dropdown-indicator"></i></a>
                <ul>
                  <li><a href="#">Cat 1</a></li>
                  <li><a href="#">Cat 2</a></li>
                  <li><a href="#">Cat 3</a></li>
                  <li><a href="#">Cat 4</a></li>
                </ul>
              </li>
              <li><a href="#" title="carrito de la compra"><i className="bi bi-cart4" title="carito de la compra" aria-hidden="true"> carrito</i></a></li>
              <li><a href="#">Registro</a></li>
              <li><a href="#" className="get-a-quote">Acceso</a></li>

            </ul>
          </nav>

        </div>
      </header>

      <section id="hero" className="hero d-flex align-items-center">
        <div className="container">
          <div className="row gy-4 d-flex justify-content-between">
            <div className="col-lg-6 order-2 order-lg-1 d-flex flex-column justify-content-center">

              <h2>Encuentra tu curso</h2>
              <p>Facere distinctio molestiae nisi fugit tenetur repellat non praesentium nesciunt optio quis sit odio nemo
                quisquam. eius quos reiciendis eum vel eum voluptatem eum maiores eaque id optio ullam occaecati odio est
                possimus vel reprehenderit</p>
              <form action="#" className="form-search d-flex align-items-stretch mb-3">
                <input type="text" className="form-control" placeholder="nombre del curso" aria-label="buscador de cursos" />
                <button type="submit" className="btn btn-primary">Search</button>
              </form>

              <div className="row gy-4">



              </div>
            </div>

            <div className="col-lg-5 order-1 order-lg-2 hero-img">
              <img src="assets/img/hero-img.svg" className="img-fluid mb-3 mb-lg-0" alt="" />
            </div>

          </div>
        </div>
      </section>
      <main id="main">

        <section className="featured-services">
          <div className="container">

            <div className="row gy-4 cursos-destacados">
              <div>
                <h1>Cursos destacados</h1>
              </div>
              <div className="col-lg-4 col-md-6 service-item d-flex">
                <div>
                  <h4 className="title">Lorem Ipsum</h4>
                  <p className="description">Voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident</p>
                  <a href="#" className="readmore stretched-link"><span>Detalle</span><i className="bi bi-arrow-right"></i></a>
                </div>
              </div>

              <div className="col-lg-4 col-md-6 service-item d-flex">
                <div>
                  <h4 className="title">Dolor Sitema</h4>
                  <p className="description">Minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat tarad limino ata</p>
                  <a href="#" className="readmore stretched-link"><span>Detalle</span><i className="bi bi-arrow-right"></i></a>
                </div>
              </div>

              <div className="col-lg-4 col-md-6 service-item d-flex">
                <div>
                  <h4 className="title">Sed ut perspiciatis</h4>
                  <p className="description">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur</p>
                  <a href="#" className="readmore stretched-link"><span>Detalle</span><i className="bi bi-arrow-right"></i></a>
                </div>
              </div>

            </div>

          </div>
        </section>

        <section className="featured-services">
          <div className="container">

            <div className="row gy-4 cursos-opiniones">
              <div>
                <h1>Opiniones</h1>
              </div>
              <div className="col-lg-4 col-md-6 service-item d-flex">
                <div>
                  <h4 className="title">Voluptatum deleniti atque </h4>
                  <p className="description">Corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident</p>
                  <a href="#" className="readmore stretched-link"><span>Detalle</span><i className="bi bi-arrow-right"></i></a>
                </div>
              </div>

              <div className="col-lg-4 col-md-6 service-item d-flex">
                <div>
                  <h4 className="title">Minim veniam</h4>
                  <p className="description">Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat tarad limino ata</p>
                  <a href="#" className="readmore stretched-link"><span>Detalle</span><i className="bi bi-arrow-right"></i></a>
                </div>
              </div>

              <div className="col-lg-4 col-md-6 service-item d-flex">
                <div>
                  <h4 className="title">Perspiciatis</h4>
                  <p className="description">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur</p>
                  <a href="#" className="readmore stretched-link"><span>Detalle</span><i className="bi bi-arrow-right"></i></a>
                </div>
              </div>

            </div>
          </div>
        </section>

        <section className="featured-services">
          <div className="container">

            <div className="row gy-4 cursos-actualizaciones">
              <div>
                <h1>Ultimas actualizaciones</h1>
              </div>
              <div className="col-lg-4 col-md-6 service-item d-flex">
                <div>
                  <h4 className="title">Voluptatum deleniti atque </h4>
                  <p className="description">Corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident</p>
                  <a href="#" className="readmore stretched-link"><span>Detalle</span><i className="bi bi-arrow-right"></i></a>
                </div>
              </div>


              <div className="col-lg-4 col-md-6 service-item d-flex">
                <div>
                  <h4 className="title">Minim veniam</h4>
                  <p className="description">Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat tarad limino ata</p>
                  <a href="#" className="readmore stretched-link"><span>Detalle</span><i className="bi bi-arrow-right"></i></a>
                </div>
              </div>

              <div className="col-lg-4 col-md-6 service-item d-flex">
                <div>
                  <h4 className="title">Perspiciatis</h4>
                  <p className="description">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur</p>
                  <a href="#" className="readmore stretched-link"><span>Detalle</span><i className="bi bi-arrow-right"></i></a>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
      <footer id="footer" className="footer">

        <div className="container">

          <div className="container mt-4">
            <div className="copyright">
              &copy; Copyright <strong><span>UNIR TFG - Frameworks frontend JavaScript: Análisis y estudio
                práctico</span></strong>. All Rights Reserved
            </div>
            <div className="credits">
              Designed by <a href="https://bootstrapmade.com/">BootstrapMade</a>
            </div>
          </div>
        </div>

      </footer>

    </div>

  )
}
