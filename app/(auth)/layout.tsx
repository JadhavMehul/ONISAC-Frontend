import "../globals.css";
import HeaderAuth from "@components/header/HeaderAuth";
import { ThemeProvider } from "@components/providers/theme-provider";


export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`antialiased`}
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
        <HeaderAuth />
        {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
