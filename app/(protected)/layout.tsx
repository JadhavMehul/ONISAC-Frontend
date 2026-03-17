'use client'
import Link from "next/link";
import "../globals.css";
import { ThemeProvider } from "@components/providers/theme-provider";
import { usePathname } from "next/navigation";
import HeaderDashboard from "@components/header/HeaderDashboard";


export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  const pathName = usePathname();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`antialiased`}
      >
        
          <div className="flex min-h-screen">

            {/* Sidebar */}
            <div className="w-[246px] bg-[#F8F9FA] border-r border-teal-400 px-4 py-2">
              <h1 className="text-2xl text-black dark:text-red-500">ONISAC</h1>

              <nav className="flex flex-col gap-3 py-4">
                <Link href={'/game/dashboard'} className={`${pathName === '/game/dashboard' && 'bg-teal-400 text-gray-700'} rounded-2xl font-helvetica px-4 py-3 font-bold text-[12px] leading-[18px] text-gray-400 hover:bg-teal-400 hover:text-white`}>Dashboard</Link>
                <Link href={'/profile'} className={`${pathName === '/profile' && 'bg-teal-400 text-gray-700'} rounded-2xl font-helvetica px-4 py-3 font-bold text-[12px] leading-[18px] text-gray-400 hover:bg-teal-400 hover:text-white`}>Tables</Link>
                <Link href={''} className={`${pathName === '/unknown' && 'bg-teal-400 text-gray-700'} rounded-2xl font-helvetica px-4 py-3 font-bold text-[12px] leading-[18px] text-gray-400 hover:bg-teal-400 hover:text-white`}>Billing</Link>
                <Link href={''} className={`${pathName === '/unknown2' && 'bg-teal-400 text-gray-700'} rounded-2xl font-helvetica px-4 py-3 font-bold text-[12px] leading-[18px] text-gray-400 hover:bg-teal-400 hover:text-white`}>RTL</Link>
            </nav>
            </div>

            {/* Main Section */}
            <div className="flex-1 flex flex-col">

              {/* Header */}
              <HeaderDashboard />

              {/* Page Content */}
              <main className="flex-1 p-8">
                {children}
              </main>

            </div>
          </div>
      </body>
    </html>
  );
}
