"use client";
import { useEffect, useState } from 'react';
import Image from 'next/image';
import SAR_MAIN from '@assets/gameAssets/SAR_MAIN.png';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@components/ui/dialog';
import { Button } from '@components/ui/button';
import { useRouter } from "next/navigation";
import { useAuth } from '@context/AuthContext';
import toast from 'react-hot-toast';

declare global {
  interface Window {
    Pi?: any;
  }
}

export default function MatchCardComponent() {
  const router = useRouter();
  const { user } = useAuth();
  const [isPiAuthenticated, setIsPiAuthenticated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const initPiNetwork = async () => {
      // 1. Wait until Next.js attaches the script globally onto the client window layout
      if (!window.Pi) {
        console.log("[Pi SDK]: Script not attached to window object yet. Retrying...");
        return;
      }

      try {
        console.log("[Pi SDK]: Commencing initialization sequence...");
        
        // 2. Define standard required incomplete payments function block
        const onIncompletePaymentFound = (payment: any) => {
          console.warn("[Pi SDK]: Incomplete transaction logged on startup:", payment);
        };

        // 3. Initialize with standard sandbox configuration flags
        await window.Pi.init({ 
          version: "2.0", 
          sandbox: true,
          onIncompletePaymentFound: onIncompletePaymentFound 
        });

        // Small micro-task queue delay to let Pi complete state hydration inside Chrome
        await new Promise((resolve) => setTimeout(resolve, 100));

        if (!isMounted) return;

        // 4. Now that initialization is confirmed finished, request scopes safely
        console.log("[Pi SDK]: Initialized successfully. Requesting authentication scopes...");
        const scopes = ['username', 'payments'];
        
        const authResult = await window.Pi.authenticate(scopes, onIncompletePaymentFound);
        
        if (isMounted && authResult) {
          console.log("[Pi SDK]: Authentication linked successfully:", authResult);
          setIsPiAuthenticated(true);
        }
      } catch (err: any) {
        console.error("[Pi SDK Error]: Sequence initialization failure:", err);
        // Don't spam toast alerts during local fast-refresh dev loops
        if (process.env.NODE_ENV !== 'development') {
          toast.error("Could not link your Pi wallet profile. Please refresh.");
        }
      }
    };

    // Give Turbopack/Next.js script hydration interactive a clean 800ms window to bind asset files
    const timer = setTimeout(initPiNetwork, 800);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  const handlePiPayment = async (wagerAmount: number) => {
    if (!window.Pi) {
      toast.error("Pi Network SDK is not available. Please try refreshing the browser.");
      return;
    }

    if (!isPiAuthenticated) {
      toast.error("Authorization scope handshake incomplete. Please wait or reload.");
      return;
    }

    try {
      const paymentData = {
        amount: wagerAmount,
        memo: `Wager entry for Slam Attax Rebellion - Tier ${wagerAmount} Pi`,
        metadata: { wagerTier: wagerAmount, email: user?.email }
      };

      const callbacks = {
        onReadyForServerApproval: async (paymentId: string) => {
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/approve-pi-payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentId })
          });
        },
        onReadyForServerCompletion: async (paymentId: string, txid: string) => {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/complete-pi-payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentId, txid, email: user?.email, amount: wagerAmount })
          });
          
          const data = await res.json();
          if (data.success) {
            toast.success(`${wagerAmount} Pi Credited! Finding match...`);
            router.push(`/game/gamePage?wager=${wagerAmount}&gameId=slam_attax_rebellion&currency=pi`);
          }
        },
        onCancel: () => toast.error("Payment cancelled by user."),
        onError: (error: any) => toast.error(`Pi Wallet Error: ${error.message}`)
      };

      window.Pi.createPayment(paymentData, callbacks);

    } catch (err) {
      console.error(err);
      toast.error("Payment setup failed.");
    }
  };

  return (
    <div className="flex flex-col justify-end items-center h-full gap-2 rounded-[8px] overflow-auto">
      <Dialog>
        <DialogTrigger className="hover:cursor-pointer">
          <Image src={SAR_MAIN} alt='Slam Attax Rebellion' />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deposit Pi directly to enter Match</DialogTitle>
            <DialogDescription className="flex flex-row gap-2 mt-3">
              <Button onClick={() => handlePiPayment(1)} className="flex-1 hover:bg-teal-400 hover:text-white" variant="outline">1 Pi</Button>
              <Button onClick={() => handlePiPayment(10)} className="flex-1 hover:bg-teal-400 hover:text-white" variant="outline">10 Pi</Button>
              <Button onClick={() => handlePiPayment(50)} className="flex-1 hover:bg-teal-400 hover:text-white" variant="outline">50 Pi</Button>
              <Button onClick={() => handlePiPayment(100)} className="flex-1 hover:bg-teal-400 hover:text-white" variant="outline">100 Pi</Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}