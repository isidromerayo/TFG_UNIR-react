import HeaderComponent from './HeaderComponent'
import FooterComponent from './FooterComponent'
import { ReactNode } from 'react'

export default function LayoutComponent({ children } : {children: ReactNode}) {
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