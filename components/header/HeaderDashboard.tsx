import InputComponent from "@components/global/InputComponent";
import ThemeToggleComponent from "@components/global/ThemeToggleComponent";
import { Button } from "@components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@components/ui/dropdown-menu";
import { useAuth } from "@context/AuthContext";
import Link from "next/link";
import { useState } from "react";
import { MdAccountCircle } from "react-icons/md";
import { TbLogout } from "react-icons/tb";

export default function HeaderDashboard() {
  const { user, loading, addPoints, logout } = useAuth();

  const [pointsToken, setPointsToken] = useState(0);
  const [open, setOpen] = useState(false);

  const addPointsFunction = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.email) {
      alert("User not found");
      return;
    }

    if (pointsToken > 0) {
      await addPoints(user.email, pointsToken);
      setOpen(false);
      setPointsToken(0)
    } else {
      alert("Points must be greater than zero")
    }
  }

  return (
    <>
    <header className="p-2 bg-[#F8F9FA] border-b border-teal-400 dark:bg-[#353535]">
        <div className="flex flex-row justify-between items-center">
            <h1 className="text-2xl text-black dark:text-[#ededed]">ONISAC</h1>
            <div className="flex flex-row justify-center items-center">
                <div className="py-2 px-3 bg-blue-100 rounded-l-[8px]">{loading? "Loading..." : `${user?.points} T`}</div>
                <div className="py-2 px-3 bg-teal-400 rounded-r-[8px] text-white font-bold">Points</div>
            </div>
            <div className="flex flex-row justify-center items-center gap-2">
              <ThemeToggleComponent />
              
            

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button>
                    <MdAccountCircle color="#00D5BD" size={39} />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="border mt-1 mr-2 border-teal-400 dark:bg-[#353535]">
                  <DropdownMenuLabel className="text-gray-400">
                    My Account
                  </DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="text-black dark:text-white">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        className="text-black dark:text-white"
                      >
                        Add Points
                      </DropdownMenuItem>
                    </DialogTrigger>

                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Points</DialogTitle>
                        <form onSubmit={addPointsFunction}>
                          <InputComponent
                            type="number"
                            value={pointsToken}
                            onChange={(e) => setPointsToken(Number(e.target.value))}
                            placeholder="Enter points"
                            className="w-full dark:placeholder:text-gray-400 dark:text-gray-400"
                          />

                          <button
                            type="submit"
                            className="bg-teal-400 border border-teal-400 p-3.5 rounded-2xl text-white font-bold text-[15px] w-fit hover:bg-teal-600"
                          >
                            {loading ? "Loading..." : "Add Points"}
                          </button>
                        </form>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={async (e) => {
                      e.preventDefault();
                      await logout();
                    }}
                    className="flex justify-between items-center w-full text-black dark:text-white"
                  >
                    Logout <TbLogout />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              
            </div>
        </div>
    </header>
    </>
  )
}
