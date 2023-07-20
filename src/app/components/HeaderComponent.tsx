
export default function HeaderComponent() {
    return (
        <header id="header" className="header d-flex align-items-center fixed-top color-react-azulclaro">
            <div className="container-fluid container-xl d-flex align-items-center justify-content-between">

                <a href="index.html" className="logo d-flex align-items-center fix-home-menu">
                    <img src="react.svg" alt="Logo React" className="unir-logo" />
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
    )
}
