import ThemeToggleComponent from "@components/global/ThemeToggleComponent";

export default function HeaderAuth() {
    

    return (
      <header className="py-6 absolute top-0 w-full z-10">
        <div className="flex justify-between items-center rounded-2xl shadow-[0px_7px_23px_0px_rgba(0,0,0,0.2)] p-6 w-full max-w-4xl mx-auto bg-white dark:bg-black ">
            <h1 className="text-2xl text-black dark:text-red-500">ONISAC</h1>

            

            <ThemeToggleComponent />
        </div>
      </header>
    )
}
