import LayoutComponent from '../components/LayoutComponent'
import '../src/app/globals.css'
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return <>
  <LayoutComponent>
        <Component {...pageProps} />
  </LayoutComponent>
  </>
}

export default MyApp