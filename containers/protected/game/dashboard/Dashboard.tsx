import MatchCardComponent from '@components/dashboard/MatchCardComponent'
import React from 'react'
import { ImFire } from 'react-icons/im'

export default function Dashboard() {
  return (
    <div className="flex flex-col justify-start items-start gap-2">
      <div className="flex flex-row justify-start items-center gap-3">
        <ImFire fontSize={18} color="#F79D05" />
        <h1 className="font-helvetica font-bold text-black text-[18px] dark:text-white">Quick Match</h1>
      </div>
      <div className="w-[130px] h-[180px] bg-[linear-gradient(to_bottom,transparent_60%,#9ca3af_100%)] rounded-[8px] border border-gray-300">
        <MatchCardComponent />
      </div>
    </div>
  )
}
