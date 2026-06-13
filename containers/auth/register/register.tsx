'use client'
import InputComponent from '@components/global/InputComponent'
import SwitchComponent from '@components/global/SwitchComponent'
import { useAuth } from '@context/AuthContext';
import Link from 'next/link';
import { useState } from 'react';

export default function RegisterContainer() {
  const { loading, register } = useAuth();


    const [data, setData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    })

    const handleSwitch = (value: boolean) => {
        console.log("Switch value:", value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.name || !data.email || !data.password || !data.confirmPassword) {
            alert("please fill the form")
        }
        
        if (data.password === data.confirmPassword) {
            await register(data.name, data.email, data.password)
        } else {
            alert("password and confirm password must be same")
        }
        

    }

    return (
        <div className="dark:bg-[#353535] pt-5">
            <div className="w-[calc(100%-48px)] rounded-2xl bg-teal-400 bg-center mx-auto h-[48vh] bg-[length:108%] dark:bg-[#0a0a0a]" style={{ backgroundImage: "url('/assets/images/pattern2.png')" }}>
                <div className="w-[380px] flex flex-col gap-[10px] justify-start items-center mx-auto pt-[124.5px]">
                    <h3 className="font-helvetica font-bold text-[32px] leading-[41.6px] text-center text-white m-0">Welcome!</h3>
                    <p className="font-helvetica text-[20px] leading-[28px] text-center text-white">Register yourself for free and play 24/7.</p>
                </div>
            </div>
            <div className="h-[90vh]"></div>
            <div className="absolute top-[303px] left-1/2 -translate-x-1/2 w-full max-w-[452px] px-[51px] py-[45px] bg-white border border-white rounded-[15px] shadow-[0px_7px_23px_0px_rgba(0,0,0,0.2)] flex flex-col gap-9 mb-[125px] dark:bg-[#353535]">
                    <h3 className="font-helvetica font-bold text-[22px] leading-[30.8px] text-gray-700 text-center dark:text-white">Register</h3>

                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-1">
                            <p className="text-gray-700 text-[14px] font-helvetica leading-5 mb-0 dark:text-gray-400">Name</p>
                            <InputComponent value={data.name} onChange={(e) => setData({...data, name: e.target.value})} placeholder="Enter full name" type="email" className="w-[100%] dark:placeholder:text-gray-400" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="text-gray-700 text-[14px] font-helvetica leading-5 mb-0 dark:text-gray-400">Email</p>
                            <InputComponent value={data.email} onChange={(e) => setData({...data, email: e.target.value})} placeholder="Your email address" type="email" className="w-[100%] dark:placeholder:text-gray-400" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="text-gray-700 text-[14px] font-helvetica leading-5 mb-0 dark:text-gray-400">Password</p>
                            <InputComponent value={data.password} onChange={(e) => setData({...data, password: e.target.value})} placeholder="Your password" type="Password" className="w-[100%] dark:placeholder:text-gray-400" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="text-gray-700 text-[14px] font-helvetica leading-5 mb-0 dark:text-gray-400">Confirm Password</p>
                            <InputComponent value={data.confirmPassword} onChange={(e) => setData({...data, confirmPassword: e.target.value})} placeholder="Confirm password" type="Password" className="w-[100%] dark:placeholder:text-gray-400" />
                        </div>
                        <div className="flex flex-row gap-[10px]">
                            <SwitchComponent onChange={handleSwitch} />
                            <p className="font-helvetica text-[12px] leading-[18px] dark:text-gray-400">Accept Terms & Conditions and Privacy Policy</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-6">
                        <button onClick={handleSubmit} className="bg-teal-400 border border-teal-400 p-3.5 rounded-2xl text-white font-helvetica font-bold text-[10px] leading-[15px] w-full hover:bg-transparent hover:border-white hover:border-white cursor-pointer">{loading ? 'loading...' : 'SIGN UP'}</button>
                        <p className="font-helvetica leading-5 text-gray-400 text-[14px] text-center">Already have an account? <Link href="login" className="text-teal-400 font-bold hover:text-white">Sign In</Link></p>
                    </div>
                </div>
        </div>
    )
}
