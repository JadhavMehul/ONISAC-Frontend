import React from 'react'
import { ImFire } from 'react-icons/im'

export default function gameHome() {
  return (
    <div className="flex flex-col justify-start items-start gap-2">
      <div className="flex flex-row justify-start items-center gap-3">
        <ImFire fontSize={18} color="#F79D05" />
        <h1 className="font-helvetica font-bold text-black text-[18px]">Quick Match</h1>
      </div>
      <div className="w-[130px] h-[180px] bg-[linear-gradient(to_bottom,transparent_60%,#9ca3af_100%)] rounded-[8px] border border-gray-300">
        <div className="flex flex-col justify-end items-center h-full gap-2 pb-3">
          <p className="text-white font-extrabold font-helvetica tracking-[2px] text-[16px] text-center">ABCD EFG</p>
          <p className="text-white font-bold font-helvetica tracking-[2px] text-[12px] text-center">HIJKLMNOP</p>
        </div>
      </div>
    </div>
  )
}
