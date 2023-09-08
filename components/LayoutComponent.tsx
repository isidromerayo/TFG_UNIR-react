import HeaderComponent from './HeaderComponent'
import FooterComponent from './FooterComponent'

export default function LayoutComponent({ children } : {children:any}) {
  return (
    <>
      <HeaderComponent></HeaderComponent>
      <main id="main">
        {children}
      </main>
      <FooterComponent></FooterComponent>
    </>
  )
}