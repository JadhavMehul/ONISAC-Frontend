'use client'
import InputComponent from "@components/global/InputComponent";
import SwitchComponent from "@components/global/SwitchComponent";
import { useAuth } from "@context/AuthContext";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function login() {
  const { login, loading } = useAuth();
  const searchParams = useSearchParams();

  const [data, setData] = useState({
    email: '',
    password: '',
  })

  const handleSwitch = (value: boolean) => {
    console.log("Switch value:", value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      await login(data.email, data.password);
      // console.log(data.email, data.password);
  }

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      alert('User registered successfully. Please login!');
    }
  }, [searchParams]);

  return (
    <div className="flex flex-row dark:bg-[#0a0a0a]">
      
      <div className="bg-white dark:bg-[#353535] w-[55%] flex items-center h-[100vh]">
        <div className="flex flex-col gap-9 w-full max-w-[350px] mx-auto">
          <div className="">
            <h1 className="font-bold text-teal-400 text-3xl font-helvetica leading-9 mb-2">Welcome Back</h1>
            <p className="font-helvetica font-bold leading-5 text-gray-400 text-[14px]">Enter your email and password to sign in</p>
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <p className="text-gray-700 text-[14px] font-helvetica leading-5 mb-0 dark:text-gray-400">Email</p>
              <InputComponent value={data.email} onChange={(e) => setData({...data, email: e.target.value})} placeholder="Your email address" type="email" className="w-[100%] dark:placeholder:text-gray-400 dark:text-gray-400" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-gray-700 text-[14px] font-helvetica leading-5 mb-0 dark:text-gray-400">Password</p>
              <InputComponent value={data.password} onChange={(e) => setData({...data, password: e.target.value})} placeholder="Your password" type="Password" className="w-[100%] dark:placeholder:text-gray-400 dark:text-gray-400" />
            </div>
            <div className="flex flex-row gap-[10px]">
              <SwitchComponent onChange={handleSwitch} />
              <p className="font-helvetica text-[12px] leading-[18px] dark:text-gray-400">Remember me</p>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <button onClick={handleSubmit} className="bg-teal-400 border border-teal-400 p-3.5 rounded-2xl text-white font-helvetica font-bold text-[10px] leading-[15px] w-full hover:bg-transparent hover:border-white hover:border-white cursor-pointer">{loading ? 'loading...' : 'SIGN UP'}</button>
            <p className="font-helvetica leading-5 text-gray-400 text-[14px] text-center">Don't have an account? <Link href="register" className="text-teal-400 font-bold hover:text-white">Sign up</Link></p>
          </div>
        </div>
      </div>

      <div className="w-[45%] bg-teal-400 bg-auto bg-center dark:bg-[#0a0a0a]" style={{ backgroundImage: "url('/assets/images/pattern.png')" }}></div>

    </div>
  );
}