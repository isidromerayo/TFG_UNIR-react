import LayoutComponent from '../components/LayoutComponent'
import '../src/app/globals.css'
import type { AppProps } from 'next/app'
import Script from 'next/script';

function MyApp({ Component, pageProps }: AppProps) {

  return <>
    <LayoutComponent>
      <Component {...pageProps} />
    </LayoutComponent>
    <Script src='/assets/vendor/bootstrap/js/bootstrap.bundle.min.js' strategy='beforeInteractive' />
    <Script src='/assets/js/main.js' strategy='beforeInteractive' />
  </>
}

export default MyApp