import LayoutComponent from '../components/LayoutComponent'
import type { AppProps } from 'next/app'
import '../styles/globals.css';


function MyApp({ Component, pageProps }: AppProps) {
  return (
      <LayoutComponent>
        <Component {...pageProps} />
      </LayoutComponent>

  )
}

export default MyApp