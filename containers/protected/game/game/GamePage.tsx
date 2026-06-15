"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { socket } from "@/lib/socket";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@components/ui/dialog";
import { useAuth } from "@context/AuthContext";
import Image from "next/image";
import WWEGoldCard from "@assets/gameAssets/WWE-Gold-Card.png";
import { MdAccountCircle } from "react-icons/md";
import FlipCard from "@components/game/FlipCard";
import { Button } from "@components/ui/button";
import { formatTime } from "@lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CardStats {
  reverse: number;
  block: number;
  ground: number;
  arial: number;
  defense: number;
  attack: number;
  star_rating: number;
}

interface CardData {
  card_image: string;
  superstar_name: string;
  year: string;
  category?: string;
  sub_category?: string;
  stats: CardStats;
}

interface ResultPayload {
  message: 'you win' | 'you lose' | 'draw';
  reason?: string;
  other_player_card_data: CardData;
  selectedStat: { p1: number; p2: number };
}

type ResultMessage = 'you win' | 'you lose' | 'draw' | 'Opponent Left - You Win' | null;

const STAT_BUTTONS: { key: keyof CardStats; label: string }[] = [
  { key: 'reverse', label: 'Reverse' },
  { key: 'ground', label: 'Ground' },
  { key: 'block', label: 'Block' },
  { key: 'arial', label: 'Arial' },
  { key: 'defense', label: 'Defense' },
  { key: 'star_rating', label: 'Star' },
  { key: 'attack', label: 'Attack' },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

function ResultBadge({ message }: { message: ResultMessage }) {
  if (!message) return null;
  const styles: Record<string, string> = {
    'Opponent Left - You Win': 'text-yellow-400',
    'you win': 'text-green-400',
    'draw': 'text-yellow-400',
    'you lose': 'text-red-400',
  };
  const labels: Record<string, string> = {
    'Opponent Left - You Win': 'Opponent disconnected — You Win!',
    'you win': 'You Win!',
    'draw': "It's a Draw!",
    'you lose': 'You Lose!',
  };
  return (
    <p className={`text-center text-[20px] ${styles[message] ?? 'text-white'}`}>
      {labels[message] ?? message}
    </p>
  );
}

function PlayerCard({ cardData, label }: { cardData: CardData; label: string }) {
  return (
    <div
      className="w-fit relative bg-contain bg-no-repeat bg-[position:center_top_13px] overflow-auto"
      style={{ backgroundImage: `url(${cardData.card_image})` }}
      role="img"
      aria-label={`${cardData.superstar_name} card`}
    >
      <Image src={WWEGoldCard} width={350} alt={label} priority />
      <div className="absolute bottom-[14px] w-full px-4">
        <div className="grid grid-cols-2 w-full mb-2">
          <div>
            <div className="rotate-[18deg]">
              <p className="font-helvetica font-bold text-[14px]">
                <span className="text-red-500">{cardData.stats.reverse}</span> Reverse
              </p>
            </div>
            <div className="rotate-[18deg]">
              <p className="font-helvetica font-bold text-[14px]">
                <span className="text-red-500">{cardData.stats.block}</span> Block
              </p>
            </div>
          </div>
          <div>
            <div className="rotate-[-18deg] text-right">
              <p className="font-helvetica font-bold text-[14px]">
                Ground <span className="text-red-500">{cardData.stats.ground}</span>
              </p>
            </div>
            <div className="rotate-[-18deg] text-right">
              <p className="font-helvetica font-bold text-[14px]">
                Arial <span className="text-red-500">{cardData.stats.arial}</span>
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 w-full">
          <div className="flex flex-col items-center justify-start me-auto w-[68px]">
            <h4 className="text-2xl text-red-500">{cardData.stats.defense}</h4>
            <p className="text-white text-[18px] leading-4">Defence</p>
          </div>
          <div className="flex flex-col justify-end items-center">
            <div className="flex flex-row items-center justify-center gap-1">
              {Array.from({ length: cardData.stats.star_rating }).map((_, i) => (
                <span key={i} aria-hidden="true">⭐</span>
              ))}
              <span className="sr-only">{cardData.stats.star_rating} stars</span>
            </div>
          </div>
          <div className="flex flex-col items-center justify-start ms-auto w-[68px]">
            <h4 className="text-2xl text-red-500">{cardData.stats.attack}</h4>
            <p className="text-white text-[18px] leading-4">Attack</p>
          </div>
        </div>
      </div>
      <p className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[10px]">{cardData.year}</p>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function GamePage() {
  const { user, loading } = useAuth();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMsg, setDialogMsg] = useState('Searching for players…');
  const [cardData, setCardData] = useState<CardData | null>(null);
  const [otherCardData, setOtherCardData] = useState<CardData | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [otherName, setOtherName] = useState('Unknown');
  const [flipState, setFlipState] = useState(false);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [resultMsg, setResultMsg] = useState<ResultMessage>(null);
  const [resultStats, setResultStats] = useState<{ p1: number; p2: number } | null>(null);
  const [timeLeft, setTimeLeft] = useState(120);

  const matchSent = useRef(false);
  const roomIdRef = useRef<string | null>(null);

  // keep ref in sync for use in callbacks
  useEffect(() => { roomIdRef.current = roomId; }, [roomId]);

  const selectStat = useCallback((stat: string) => {
    if (!roomIdRef.current) return;
    socket.emit('select_stat', { roomId: roomIdRef.current, stat });
  }, []);

  useEffect(() => {
    if (loading || !user) return;

    // Set auth credentials and connect
    socket.auth = { uid: user.uid, name: user.name };
    if (!socket.connected) socket.connect();

    // Emit find_match only once
    if (!matchSent.current) {
      socket.emit('find_match');
      matchSent.current = true;
    }

    setDialogOpen(true);

    // ── Handlers ──────────────────────────────────────────────────────────────

    const onMatchFound = ({ roomId }: { roomId: string }) => {
      setRoomId(roomId);
      setDialogMsg('Match found!');
      // Auto-close dialog after brief delay
      setTimeout(() => setDialogOpen(false), 800);
    };

    const onYourData = (card: CardData) => {
      setCardData(card);
      setDialogOpen(false);
    };

    const onOtherUserName = (name: string) => setOtherName(name);

    const onTurn = ({ turn }: { turn: string }) => setIsMyTurn(turn === user.uid);

    const onTimerUpdate = ({ timeLeft }: { timeLeft: number }) => setTimeLeft(timeLeft);

    const onResult = (res: ResultPayload) => {
      const msg: ResultMessage =
        res.reason === 'opponent_left' ? 'Opponent Left - You Win' : res.message;
      setResultMsg(msg);
      setOtherCardData(res.other_player_card_data);
      setResultStats(res.selectedStat);
      setFlipState(true);
      socket.disconnect();
    };

    // ── Register listeners ─────────────────────────────────────────────────────

    socket.on('match_found', onMatchFound);
    socket.on('your_data', onYourData);
    socket.on('other_user_name', onOtherUserName);
    socket.on('turn', onTurn);
    socket.on('timer_update', onTimerUpdate);
    socket.on('result', onResult);

    // ── Cleanup ────────────────────────────────────────────────────────────────

    return () => {
      socket.off('match_found', onMatchFound);
      socket.off('your_data', onYourData);
      socket.off('other_user_name', onOtherUserName);
      socket.off('turn', onTurn);
      socket.off('timer_update', onTimerUpdate);
      socket.off('result', onResult);
      socket.disconnect();
    };
  }, [user, loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-400 text-lg">Loading…</p>
      </div>
    );
  }

  return (
    <div>
      {cardData && (
        <div className="grid grid-cols-3 gap-4">
          {/* ── My Card ── */}
          <div className="w-fit">
            <div className="flex flex-row justify-start items-center gap-2 mb-3">
              <MdAccountCircle color="#00D5BD" size={39} aria-hidden="true" />
              <p className="dark:text-white">{user?.name}</p>
            </div>
            <PlayerCard cardData={cardData} label="Your card" />
            <div className="mt-2 text-center">
              <h3 className="text-3xl text-black dark:text-white">{cardData.superstar_name}</h3>
              <div className="flex flex-row justify-center items-center gap-4">
                {cardData.sub_category && (
                  <h4 className="text-[20px] text-black dark:text-white">{cardData.sub_category}</h4>
                )}
                {cardData.category && (
                  <h4 className="text-[20px] text-black dark:text-white">{cardData.category}</h4>
                )}
              </div>
            </div>
          </div>

          {/* ── Center panel ── */}
          <div className="relative flex items-center justify-center">
            <div className="w-[250px] text-center">
              {/* Timer */}
              <div className="mb-8">
                <h1 className="text-black dark:text-white text-4xl font-helvetica">Timer</h1>
                <p className="text-black dark:text-white text-3xl font-helvetica font-extralight tabular-nums">
                  {formatTime(timeLeft)}
                </p>
              </div>

              {/* Result */}
              <ResultBadge message={resultMsg} />

              {/* Score display */}
              {resultStats && (
                <div
                  className="grid grid-cols-2 rounded-2xl border-2 border-gray-500 w-[200px] h-[70px] mx-auto mt-2"
                  style={{ background: 'radial-gradient(circle, #FFFFFF 10%, #D1D5DC 100%)' }}
                  aria-label={`Score: ${resultStats.p1} vs ${resultStats.p2}`}
                >
                  <div className="border-r-2 border-black flex items-center justify-center">
                    <span className="text-red-500 text-[44px] leading-none">{resultStats.p1}</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="text-red-500 text-[44px] leading-none">{resultStats.p2}</span>
                  </div>
                </div>
              )}

              {/* Turn actions */}
              {!resultMsg && isMyTurn && (
                <div className="mt-4" aria-label="Choose your stat">
                  <p className="text-black dark:text-white text-[16px] mb-2 font-medium">
                    Your turn — pick a stat
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {STAT_BUTTONS.filter((_, i) => i < 4).map(({ key, label }) => (
                      <Button
                        key={key}
                        onClick={() => selectStat(key)}
                        variant="outline"
                        className="hover:bg-teal-400 hover:text-white hover:border-teal-400 transition-colors"
                      >
                        {label}
                      </Button>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {STAT_BUTTONS.filter((_, i) => i >= 4).map(({ key, label }) => (
                      <Button
                        key={key}
                        onClick={() => selectStat(key)}
                        variant="outline"
                        className="hover:bg-teal-400 hover:text-white hover:border-teal-400 transition-colors"
                      >
                        {label}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {!resultMsg && !isMyTurn && (
                <p className="text-gray-400 text-[14px] mt-4 italic">
                  Waiting for {otherName}…
                </p>
              )}
            </div>
          </div>

          {/* ── Opponent Card ── */}
          <div className="w-fit ms-auto">
            <div className="flex flex-row justify-end items-center gap-2 mb-3">
              <p className="dark:text-white">{otherName}</p>
              <MdAccountCircle color="#00D5BD" size={39} aria-hidden="true" />
            </div>
            <FlipCard cardData={otherCardData} flip={flipState} />
          </div>
        </div>
      )}

      {/* Matchmaking dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className="[&>button]:hidden"
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>{dialogMsg}</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-4">
            <div className="w-8 h-8 border-4 border-teal-400 border-t-transparent rounded-full animate-spin" />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}