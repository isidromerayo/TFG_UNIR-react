import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <link rel="stylesheet" href="/assets/vendor/bootstrap/css/bootstrap.min.css" />
          <link rel="stylesheet" href="/assets/vendor/bootstrap-icons/bootstrap-icons.css" />
          <link rel="stylesheet" href="/assets/vendor/fontawesome-free/css/all.min.css" />
          <link rel="stylesheet" href="/assets/css/main.css" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
