
import { AuthProvider } from "@context/AuthContext";
import { ThemeProvider } from "@context/ThemeContext";
import { Geist } from "next/font/google";
import { Toaster } from 'react-hot-toast';
import { cn } from "@/lib/utils";
import Script from "next/script";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


export default function RootLayout({children}: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <Script
          src="https://sdk.minepi.com/pi-sdk.js" 
          strategy="afterInteractive" 
        />
      <body>
        <ThemeProvider>
            <AuthProvider>
            <Toaster position="top-right" />
            {children}
            </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}