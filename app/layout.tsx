
import { AuthProvider } from "@context/AuthContext";
import { ThemeProvider } from "@context/ThemeContext";
import { Geist } from "next/font/google";
import { Toaster } from 'react-hot-toast';
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


export default function RootLayout({children}: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
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