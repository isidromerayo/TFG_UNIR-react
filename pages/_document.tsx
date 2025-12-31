import Document, { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          {/* eslint-disable-next-line @next/next/no-css-tags */}
          <link rel="stylesheet" href="/assets/vendor/bootstrap/css/bootstrap.min.css" />
          {/* eslint-disable-next-line @next/next/no-css-tags */}
          <link rel="stylesheet" href="/assets/vendor/bootstrap-icons/bootstrap-icons.css" />
          {/* eslint-disable-next-line @next/next/no-css-tags */}
          <link rel="stylesheet" href="/assets/vendor/fontawesome-free/css/all.min.css" />
          {/* eslint-disable-next-line @next/next/no-css-tags */}
          <link rel="stylesheet" href="/assets/css/main.css" />
        </Head>
        <body>
          <Main />
          <NextScript />
          <Script src="/assets/vendor/bootstrap/js/bootstrap.bundle.min.js" strategy="beforeInteractive" />
          <Script src="/assets/js/main.js" strategy="beforeInteractive" />
        </body>
      </Html>
    )
  }
}

export default MyDocument
