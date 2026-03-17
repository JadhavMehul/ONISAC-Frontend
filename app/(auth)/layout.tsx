import { ThemeProvider } from '@context/ThemeContext';
import '../globals.css';
import HeaderAuth from '@components/header/HeaderAuth';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`antialiased`}>
        <ThemeProvider>
          <HeaderAuth />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
