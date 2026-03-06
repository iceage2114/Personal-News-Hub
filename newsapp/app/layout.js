export const metadata = {
  title: 'News App',
  description: 'Latest news from around the world',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}