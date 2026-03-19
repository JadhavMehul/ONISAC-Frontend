import ThemeToggleComponent from "@components/global/ThemeToggleComponent";
import { useAuth } from "@context/AuthContext";
import Link from "next/link";
import { MdAccountCircle } from "react-icons/md";

export default function HeaderDashboard() {
  const { user, loading, logout } = useAuth();
  return (
    <header className="p-2 bg-[#F8F9FA] border-b border-teal-400 dark:bg-[#353535]">
        <div className="flex flex-row justify-between items-center">
            <h1 className="text-2xl text-black dark:text-[#ededed]">ONISAC</h1>
            <div className="flex flex-row justify-center items-center">
                <div className="py-2 px-3 bg-blue-100 rounded-l-[8px]">1000 T</div>
                <div className="py-2 px-3 bg-teal-400 rounded-r-[8px] text-white font-bold">Points</div>
            </div>
            <div className="flex flex-row justify-center items-center gap-2">
              <ThemeToggleComponent />
              <Link href={"/profile"}>
                <MdAccountCircle color="#00D5BD" fontSize={39} /> 
              </Link>
              <button onClick={async (e)=>{e.preventDefault(); await logout()}}>
                <MdAccountCircle color="#00D5BD" fontSize={39} /> 
              </button>
            </div>
        </div>
    </header>
  )
}
