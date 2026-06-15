"use client"
import Image from 'next/image'
import SAR_MAIN from '@assets/gameAssets/SAR_MAIN.png'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@components/ui/dialog'
import { Button } from '@components/ui/button'
import { useRouter } from "next/navigation";

export default function MatchCardComponent() {
  const router = useRouter();
  return (
    <div className="flex flex-col justify-end items-center h-full gap-2 rounded-[8px] overflow-auto">
        
        <Dialog>
            <DialogTrigger className="hover:cursor-pointer">
                <Image src={SAR_MAIN} alt='slam attax rebelian' />
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Please select points to play.</DialogTitle>
                    <DialogDescription className="flex flex-row gap-2">
                        <Button onClick={() => router.push("/game/gamePage")} className="flex-1 hover:bg-teal-400 hover:text-white" variant="outline">1 T</Button>
                        <Button onClick={() => router.push("/game/gamePage")} className="flex-1 hover:bg-teal-400 hover:text-white" variant="outline">10 T</Button>
                        <Button onClick={() => router.push("/game/gamePage")} className="flex-1 hover:bg-teal-400 hover:text-white" variant="outline">50 T</Button>
                        <Button onClick={() => router.push("/game/gamePage")} className="flex-1 hover:bg-teal-400 hover:text-white" variant="outline">100 T</Button>
                    </DialogDescription>
                    <DialogDescription>
                        Platform fee 0.1 T
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    </div>
  )
}
