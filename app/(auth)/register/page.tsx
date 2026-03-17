'use client'
import InputComponent from '@components/global/InputComponent'
import SwitchComponent from '@components/global/SwitchComponent'
import Link from 'next/link';

export default function register() {

    const handleSwitch = (value: boolean) => {
        console.log("Switch value:", value);
    };
    return (
        <div className="">
            <div className="w-[calc(100%-48px)] rounded-2xl bg-teal-400 bg-center mx-auto mt-6 h-[48vh] bg-[length:108%]" style={{ backgroundImage: "url('/assets/images/pattern2.png')" }}>
                <div className="w-[380px] flex flex-col gap-[10px] justify-start items-center mx-auto pt-[124.5px]">
                    <h3 className="font-helvetica font-bold text-[32px] leading-[41.6px] text-center text-white m-0">Welcome!</h3>
                    <p className="font-helvetica text-[20px] leading-[28px] text-center text-white">Register yourself for free and play 24/7.</p>
                </div>
            </div>
            <div className="h-[90vh]"></div>
            <div className="absolute top-[303px] left-1/2 -translate-x-1/2 w-full max-w-[452px] px-[51px] py-[45px] bg-white rounded-[15px] shadow-[0px_7px_23px_0px_rgba(0,0,0,0.2)] flex flex-col gap-9 mb-[125px]">
                    <h3 className="font-helvetica font-bold text-[22px] leading-[30.8px] text-gray-700 text-center">Register</h3>

                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-1">
                            <p className="text-gray-700 text-[14px] font-helvetica leading-5 mb-0">Name</p>
                            <InputComponent placeholder="Enter full name" type="email" className="w-[100%]" />
                        </div>
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
                            <p className="font-helvetica text-[12px] leading-[18px]">Accept Terms & Conditions and Privacy Policy</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-6">
                        <button className="bg-teal-400 p-3.5 rounded-2xl text-white font-helvetica font-bold text-[10px] leading-[15px] w-full">SIGN UP</button>
                        <p className="font-helvetica leading-5 text-gray-400 text-[14px] text-center">Already have an account? <Link href="login" className="text-teal-400 font-bold">Sign In</Link></p>
                    </div>
                </div>
        </div>
    )
}
