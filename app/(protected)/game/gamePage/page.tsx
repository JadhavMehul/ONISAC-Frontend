"use client";

import { useEffect, useRef, useState } from "react";
import { socket } from "@/lib/socket";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@components/ui/dialog";
import { useAuth } from "@context/AuthContext";
import Image from "next/image";
import WWEGoldCard from "@assets/gameAssets/WWE-Gold-Card.png";
import WWESilverCard from "@assets/gameAssets/WWE-Silver-Card.png";
import WWENormalCard from "@assets/gameAssets/WWE-Normal-Card.png";
import { MdAccountCircle } from "react-icons/md";
import FlipCard from "@components/game/FlipCard";
import { Button } from "@components/ui/button";

export default function Home() {
    const { user, loading } = useAuth();
    const [open, setOpen] = useState(false);
    const [cardData, setCardData] = useState<any>(null);
    const [otherCardData, setOtherCardData] = useState<any>(null);
    const [roomId, setRoomId] = useState();
    const [popOverMsg, setPopOverMsg] = useState("Searching Players")
    const [otherName, setOtherName] = useState("Unknown")
    const [flipState, setFlipState] = useState(false)
    const [isMyTurn, setIsMyTurn] = useState(false);
    const [resultShow, setResultShow] = useState<any>();
    const [resultMsg, setResultMsg] = useState<string>();

    const hasSentMatch = useRef(false);
    

    const selectStat = (stat: string) => {
        socket.emit("select_stat", { roomId, stat });
    };

    useEffect(() => {
    // Connect (if not auto-connected)
        if (loading || !user) return;

        socket.auth = {
            uid: user.uid, // send your backend user id
            name: user.name
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
            console.log(card);
            setOpen(false)
        });

        socket.on("other_user_name", (name) => {
            setOtherName(name);
        })

        socket.on("turn", ({ turn }) => {
            setIsMyTurn(turn === user.uid);
        });

        socket.on("result", (res) => {
            setResultMsg(res.message); // "you win" or "you lose"
            setOtherCardData(res.other_player_card_data); 
            setResultShow(res.selectedStat)  
            // console.log(res.selectedStat)  
            setFlipState(true);
            socket.disconnect();
        });

        setOpen(true);
        // Cleanup
        return () => {
            socket.off("match_found");
            socket.off("your_data");
            socket.off("other_user_name");
            socket.off("result");
            socket.off("turn");
            socket.disconnect();
        };
    }, [user, loading]);


  return (
    <div>
        {cardData && (
            <div className="grid grid-cols-3">
                <div className="w-fit">
                    <div className="flex flex-row justify-start items-center gap-2 mb-3">
                        <MdAccountCircle color="#00D5BD" size={39} />
                        <p className="">{user?.name}</p>
                    </div>
                    <div className="w-fit">
                        <div className="w-fit relative bg-orange-500 bg-contain bg-no-repeat bg-[position:center_top_13px] overflow-auto" style={{
                            backgroundImage: `url(${cardData?.card_image})`,
                        }}>
                            <Image src={WWEGoldCard} width={350} alt="" />


                            <div className="absolute bottom-[14px] w-full px-4">
                                <div className="grid grid-cols-2 w-full mb-2">
                                    <div className="">
                                        <div className="rotate-[18deg]">
                                            <p className="font-helvetica font-bold text-[14px]"><span className="font-helvetica font-bold text-red-500">{cardData?.stats?.reverse}</span> Reverse</p>
                                        </div>
                                        <div className="rotate-[18deg]">
                                            <p className="font-helvetica font-bold text-[14px]"><span className="font-helvetica font-bold text-red-500">{cardData?.stats?.block}</span> Block</p>
                                        </div>
                                    </div>
                                    <div className="">
                                        <div className="rotate-[-18deg] text-right">
                                            <p className="font-helvetica font-bold text-[14px]">Ground <span className="font-helvetica font-bold text-red-500">{cardData?.stats?.ground}</span></p>
                                        </div>
                                        <div className="rotate-[-18deg] text-right">
                                            <p className="font-helvetica font-bold text-[14px]">Arial <span className="font-helvetica font-bold text-red-500">{cardData?.stats?.arial}</span></p>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 w-full">
                                    <div className="flex flex-col items-center justify-start me-auto w-[68px]">
                                        <h4 className="text-2xl text-red-500">{cardData?.stats?.defense}</h4>
                                        <p className="text-white text-[18px] leading-4">Defence</p>
                                    </div>
                                    <div className="flex flex-col justify-end items-center">
                                        <div className="flex flex-row items-center justify-center gap-1">
                                            {Array.from({ length: cardData?.stats?.star_rating }).map((_, i) => (
                                                <span key={i}>⭐</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center justify-start ms-auto w-[68px]">
                                        <h4 className="text-2xl text-red-500">{cardData?.stats?.attack}</h4>
                                        <p className="text-white text-[18px] leading-4">Attack</p>
                                    </div>
                                </div>

                            </div>

                        </div>
                        <div className="">
                            <h3 className="text-3xl text-center text-black dark:text-white">{cardData.superstar_name}</h3>
                            <div className="flex flex-row justify-center items-center gap-4 ">
                                {cardData.sub_category && <h4 className="text-[20px] text-center text-black dark:text-white">{cardData.sub_category}</h4>}
                                {cardData.category && <h4 className="text-[20px] text-right text-black dark:text-white">{cardData.category}</h4>}
                            </div>
                        </div>
                    </div>

                </div>
                <div className="relative">
                   
                    <div className="absolute top-1/2 left-1/2 -translate-1/2 w-[250px]">
                        {resultMsg && (
                            resultMsg === 'you win' ? (
                                <p className="text-center text-green-400 text-[20px]">You Win!</p>
                            ) : resultMsg === 'draw' ? (
                                <p className="text-center text-yellow-400 text-[20px]">It's a Draw!</p>
                            ) : (
                                <p className="text-center text-red-400 text-[20px]">You Lose!</p>
                            )
                        )}
                        <div className="grid grid-cols-2 rounded-2xl border-2 border-gray-500 w-[200px] h-[70px] mx-auto" style={{
                            background: "radial-gradient(circle, #FFFFFF 10%, #D1D5DC 100%)",
                        }}>
                            <div className="border-r-2 border-black">
                                <h1 className="text-red-500 text-center text-[44px]">{resultShow?.p1}</h1>
                                <h4 className="text-black"></h4>
                            </div>
                            <div className="">
                                <h1 className="text-red-500 text-center text-[44px]">{resultShow?.p2}</h1>
                                <h4 className="text-black"></h4>
                            </div>
                        </div>

                        {!resultMsg && isMyTurn && (<>
                            <p className="text-center text-black text-[20px] mt-2">Your Turn Play</p>
                            <div className="w-full grid grid-cols-2 gap-2 mt-2">
                                <Button disabled={!isMyTurn} onClick={() => selectStat("reverse")} variant={"outline"}>reverse</Button>
                                <Button disabled={!isMyTurn} onClick={() => selectStat("ground")} variant={"outline"}>ground</Button>
                                <Button disabled={!isMyTurn} onClick={() => selectStat("block")} variant={"outline"}>block</Button>
                                <Button disabled={!isMyTurn} onClick={() => selectStat("arial")} variant={"outline"}>arial</Button>
                            </div>
                            <div className="w-full grid grid-cols-3 gap-2 mt-2">
                                <Button disabled={!isMyTurn} onClick={() => selectStat("defense")} variant={"outline"}>defense</Button>
                                <Button disabled={!isMyTurn} onClick={() => selectStat("star_rating")} variant={"outline"}>star</Button>
                                <Button disabled={!isMyTurn} onClick={() => selectStat("attack")} variant={"outline"}>attack</Button>
                            </div>
                        </>)}
                    </div>
                </div>
                <div className="w-fit ms-auto">
                    <div className="flex flex-row justify-end items-center gap-2 mb-3">
                        <p className="">{otherName}</p>
                        <MdAccountCircle color="#00D5BD" size={39} />
                    </div>

                    <FlipCard cardData={otherCardData} flip={flipState} />

                    
                </div>
            </div>
        )}
        

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