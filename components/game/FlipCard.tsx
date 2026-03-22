"use client";

import WWEGoldCard from "@assets/gameAssets/WWE-Gold-Card.png";
import TransCard from "@assets/gameAssets/TransCard.png";
import Image from "next/image";


type FlipCardProps = {
  flip?: boolean;
  cardData?: any;
};
export default function FlipCard({ flip = false, cardData }: FlipCardProps) {
  return (
    <div className="bg-transparent w-[350px] perspective-[1000px]">
        <div className={`relative w-full h-full text-center transition-transform duration-700 [transform-style:preserve-3d] shadow-md ${
          flip ? "[transform:rotateY(180deg)]" : ""
        }`}>
            {/* Front Card */}
            <div className="absolute w-full h-full [backface-visibility:hidden] bg-[#bbb] text-black">
                <div className="relative bg-gray-300 ">
                    <Image src={TransCard} width={350} alt="" />
                    <h1 className="absolute top-1/2 left-1/2 -translate-1/2 text-red-400 font-helvetica font-extrabold text-2xl">Oponent Card</h1>
                </div>
            </div>

            {/* Back Card */}
            <div className="absolute w-full h-full [backface-visibility:hidden] bg-[#2980b9] text-white [transform:rotateY(180deg)]">
                {cardData && 
                    <div className="w-fit">
                        <div className="w-fit relative bg-orange-500 bg-contain bg-no-repeat bg-[position:center_top_13px] overflow-auto" style={{
                            backgroundImage: `url(${cardData?.card_image})`,
                        }}>
                            <Image src={WWEGoldCard} width={350} alt="" />


                            <div className="absolute bottom-[14px] w-full px-4">
                                <div className="grid grid-cols-2 w-full mb-2">
                                    <div className="">
                                        <div className="rotate-[18deg]">
                                            <p className="font-helvetica font-bold text-[14px] text-black text-left"><span className="font-helvetica font-bold text-red-500">{cardData?.stats?.reverse}</span> Reverse</p>
                                        </div>
                                        <div className="rotate-[18deg]">
                                            <p className="font-helvetica font-bold text-[14px] text-black text-left"><span className="font-helvetica font-bold text-red-500">{cardData?.stats?.block}</span> Block</p>
                                        </div>
                                    </div>
                                    <div className="">
                                        <div className="rotate-[-18deg] text-right">
                                            <p className="font-helvetica font-bold text-[14px] text-black">Ground <span className="font-helvetica font-bold text-red-500">{cardData?.stats?.ground}</span></p>
                                        </div>
                                        <div className="rotate-[-18deg] text-right">
                                            <p className="font-helvetica font-bold text-[14px] text-black">Arial <span className="font-helvetica font-bold text-red-500">{cardData?.stats?.arial}</span></p>
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
                }
            </div>
        </div>
    </div>
  );
}