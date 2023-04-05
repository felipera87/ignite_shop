import { getCssText } from '@/styles'
import { Html, Head, Main, NextScript } from 'next/document'

/**
 * dangerouslySetInnerHTML allows the css to render on server side instead of loading using javascript code on browser.
 * If user disable javascript it'll not load the css, but with that style tag it process the css on server
 */

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet" />

        <style id="stitches" dangerouslySetInnerHTML={{ __html: getCssText() }} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
