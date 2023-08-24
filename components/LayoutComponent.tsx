import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import SliderComponent from './SliderComponent'
import HeaderComponent from './HeaderComponent'
import FooterComponent from './FooterComponent'

export default function LayoutComponent({ children }) {
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