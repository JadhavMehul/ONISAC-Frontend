"use client";

import { useEffect, useRef, useState } from "react";
import { socket } from "@/lib/socket";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@components/ui/dialog";
import { useAuth } from "@context/AuthContext";

export default function Home() {
    const { user, loading } = useAuth();
    const [open, setOpen] = useState(false);
    const [cardData, setCardData] = useState<any>(null);
    const [roomId, setRoomId] = useState();
    const [popOverMsg, setPopOverMsg] = useState("Searching Players")

    const hasSentMatch = useRef(false);
    

    useEffect(() => {
    // Connect (if not auto-connected)
        if (loading || !user) return;

        socket.auth = {
            uid: user.uid, // send your backend user id
        };
        // Connect only if not already connected
        if (!socket.connected) {
            socket.connect();
        }

        if (!hasSentMatch.current) {
            socket.emit("find_match");
            hasSentMatch.current = true;
        }

        // socket.off("match_found");
        // socket.off("your_data");

        socket.on("match_found", ({ roomId }) => {
            setRoomId(roomId);
            setPopOverMsg("Match Found")
        });

        socket.on("your_data", (card) => {
            setCardData(card);
            setOpen(false)
        });

        setOpen(true);
        // Cleanup
        return () => {
            socket.off("match_found");
            socket.off("your_data");
            socket.disconnect();
        };
    }, [user, loading]);


  return (
    <div style={{ padding: 20 }}>
      <br />
      {cardData ? 'card data found' : 'no card data'}
      <br />
      {roomId ? roomId : 'no room id'}

        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{popOverMsg}</DialogTitle>
                </DialogHeader>
            </DialogContent>
        </Dialog>

    </div>
  );
}