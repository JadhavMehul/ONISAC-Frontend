"use client";
import Image from 'next/image';
import SAR_MAIN from '@assets/gameAssets/SAR_MAIN.png';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@components/ui/dialog';
import { Button } from '@components/ui/button';
import { useRouter } from "next/navigation";

export default function MatchCardComponent() {
  const router = useRouter();

  // Redirect to the game view while preserving exactly how many tokens they chose to risk!
  const startQueueSearch = (wagerAmount: number) => {
    router.push(`/game/gamePage?wager=${wagerAmount}&gameId=slam_attax_rebellion&currency=points`);
  };

  return (
    <div className="flex flex-col justify-end items-center h-full gap-2 rounded-[8px] overflow-auto">
        <Dialog>
            <DialogTrigger className="hover:cursor-pointer">
                <Image src={SAR_MAIN} alt='Slam Attax Rebellion Matchmaking Entrance' />
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Select Your Wager Token Tier</DialogTitle>
                    <DialogDescription className="flex flex-row gap-2 mt-3">
                        <Button onClick={() => startQueueSearch(1)} className="flex-1 hover:bg-teal-400 hover:text-white" variant="outline">1 T</Button>
                        <Button onClick={() => startQueueSearch(10)} className="flex-1 hover:bg-teal-400 hover:text-white" variant="outline">10 T</Button>
                        <Button onClick={() => startQueueSearch(50)} className="flex-1 hover:bg-teal-400 hover:text-white" variant="outline">50 T</Button>
                        <Button onClick={() => startQueueSearch(100)} className="flex-1 hover:bg-teal-400 hover:text-white" variant="outline">100 T</Button>
                    </DialogDescription>
                    <DialogDescription className="text-xs text-gray-400 mt-2 text-center">
                        Platform House Fee: 0.1 T deducted atomically per match entry.
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    </div>
  );
}