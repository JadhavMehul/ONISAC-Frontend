import { ThemeProvider } from "@context/ThemeContext";
import "../globals.css";
import HeaderAuth from "@components/header/HeaderAuth";
import { AuthProvider } from "@context/AuthContext";


export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* <ThemeProvider> */}
          <HeaderAuth />
          {children}
      {/* </ThemeProvider> */}
    </>
  );
}
