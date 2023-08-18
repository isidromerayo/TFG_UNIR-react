import Image from "next/image"

const Custom404: NextPage = () => {
  return (
    <>
      <div className="container pagina-datos">
        <h1>Página no encontrada...</h1>

        <div className="col-lg-5 order-1 order-lg-2 hero-img">
          <Image src="/assets/img/hero-img.svg" width={500} height={500} className="img-fluid mb-3 mb-lg-0" alt="" />
        </div>
        <pre>
          error 404
        </pre>
      </div>
    </>
  )
}

export default Custom404