export default function HeaderDashboard() {
  return (
    <header className="p-2 bg-[#F8F9FA] border-b border-teal-400">
        <div className="flex flex-row justify-between items-center">
            <h1 className="text-2xl text-black dark:text-red-500">ONISAC</h1>
            <div className="flex flex-row justify-center items-center">
                <div className="py-2 px-3 bg-blue-100 rounded-l-[8px]">1000 T</div>
                <div className="py-2 px-3 bg-teal-400 rounded-r-[8px] text-white font-bold">Points</div>
            </div>
            <div className="">Account</div>
        </div>
    </header>
  )
}
