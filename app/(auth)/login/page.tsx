'use client'
import InputComponent from "@components/global/InputComponent";
import SwitchComponent from "@components/global/SwitchComponent";
import Link from "next/link";

export default function login() {

  const handleSwitch = (value: boolean) => {
    console.log("Switch value:", value);
  };

  return (
    <div className="flex flex-row dark:bg-black">
      
      <div className="bg-white w-[55%] flex items-center h-[100vh]">
        <div className="flex flex-col gap-9 w-full max-w-[350px] mx-auto">
          <div className="">
            <h1 className="font-bold text-teal-400 text-3xl font-helvetica leading-9 mb-2">Welcome Back</h1>
            <p className="font-helvetica font-bold leading-5 text-gray-400 text-[14px]">Enter your email and password to sign in</p>
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <p className="text-gray-700 text-[14px] font-helvetica leading-5 mb-0">Email</p>
              <InputComponent placeholder="Your email address" type="email" className="w-[100%]" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-gray-700 text-[14px] font-helvetica leading-5 mb-0">Password</p>
              <InputComponent placeholder="Your password" type="Password" className="w-[100%]" />
            </div>
            <div className="flex flex-row gap-[10px]">
              <SwitchComponent onChange={handleSwitch} />
              <p className="font-helvetica text-[12px] leading-[18px]">Remember me</p>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <button className="bg-teal-400 p-3.5 rounded-2xl text-white font-helvetica font-bold text-[10px] leading-[15px] w-full">SIGN IN</button>
            <p className="font-helvetica leading-5 text-gray-400 text-[14px] text-center">Don't have an account? <Link href="register" className="text-teal-400 font-bold">Sign up</Link></p>
          </div>
        </div>
      </div>

      <div className="w-[45%] bg-teal-400 bg-auto bg-center" style={{ backgroundImage: "url('/assets/images/pattern.png')" }}></div>

    </div>
  );
}