import "./globals.css";

export const metadata = {
  title: 'Spotify Now Playing',
  description: 'Now playing & top tracks using Spotify API',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main className="min-h-screen text-slate-900">
          {children}
        </main>
      </body>
    </html>
  );
}
