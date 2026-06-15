'use client';
import InputComponent from '@components/global/InputComponent';
import SwitchComponent from '@components/global/SwitchComponent';
import { useAuth } from '@context/AuthContext';
import Link from 'next/link';
import { useState } from 'react';

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
}

export default function RegisterContainer() {
  const { loading, register } = useAuth();

  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const update = (field: keyof typeof data) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setData((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!data.name.trim()) e.name = 'Full name is required.';
    if (!data.email.trim()) {
      e.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      e.email = 'Enter a valid email address.';
    }
    if (!data.password) {
      e.password = 'Password is required.';
    } else if (data.password.length < 8) {
      e.password = 'Password must be at least 8 characters.';
    }
    if (!data.confirmPassword) {
      e.confirmPassword = 'Please confirm your password.';
    } else if (data.password !== data.confirmPassword) {
      e.confirmPassword = 'Passwords do not match.';
    }
    if (!acceptedTerms) e.terms = 'You must accept the Terms & Conditions.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await register(data.name, data.email, data.password);
    } catch {
      // error toast handled in AuthContext
    }
  };

  return (
    <div className="dark:bg-[#353535] pt-5 min-h-screen">
      {/* Hero banner */}
      <div
        className="w-[calc(100%-48px)] rounded-2xl bg-teal-400 bg-center mx-auto h-[48vh] bg-[length:108%] dark:bg-[#0a0a0a]"
        style={{ backgroundImage: "url('/assets/images/pattern2.png')" }}
        aria-hidden="true"
      >
        <div className="w-[380px] flex flex-col gap-[10px] justify-start items-center mx-auto pt-[124.5px]">
          <h3 className="font-helvetica font-bold text-[32px] leading-[41.6px] text-center text-white m-0">
            Welcome!
          </h3>
          <p className="font-helvetica text-[20px] leading-[28px] text-center text-white">
            Register for free and play 24/7.
          </p>
        </div>
      </div>

      {/* Spacer for card overlap */}
      <div className="h-[90vh]" aria-hidden="true" />

      {/* Register card */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="absolute top-[303px] left-1/2 -translate-x-1/2 w-full max-w-[452px] px-[51px] py-[45px] bg-white border border-white rounded-[15px] shadow-[0px_7px_23px_0px_rgba(0,0,0,0.2)] flex flex-col gap-9 mb-[125px] dark:bg-[#353535]"
      >
        <h3 className="font-helvetica font-bold text-[22px] leading-[30.8px] text-gray-700 text-center dark:text-white">
          Create Account
        </h3>

        <div className="flex flex-col gap-6">
          {/* Name */}
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-gray-700 text-[14px] font-helvetica leading-5 dark:text-gray-400">
              Full Name
            </label>
            <InputComponent
              value={data.name}
              onChange={update('name')}
              placeholder="John Doe"
              type="text"
              className="w-full dark:placeholder:text-gray-400"
            />
            {errors.name && <p className="text-red-500 text-[12px]">{errors.name}</p>}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label htmlFor="reg-email" className="text-gray-700 text-[14px] font-helvetica leading-5 dark:text-gray-400">
              Email
            </label>
            <InputComponent
              value={data.email}
              onChange={update('email')}
              placeholder="you@example.com"
              type="email"
              className="w-full dark:placeholder:text-gray-400"
            />
            {errors.email && <p className="text-red-500 text-[12px]">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label htmlFor="reg-password" className="text-gray-700 text-[14px] font-helvetica leading-5 dark:text-gray-400">
              Password
            </label>
            <InputComponent
              value={data.password}
              onChange={update('password')}
              placeholder="At least 8 characters"
              type="password"
              className="w-full dark:placeholder:text-gray-400"
            />
            {errors.password && <p className="text-red-500 text-[12px]">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1">
            <label htmlFor="confirm-password" className="text-gray-700 text-[14px] font-helvetica leading-5 dark:text-gray-400">
              Confirm Password
            </label>
            <InputComponent
              value={data.confirmPassword}
              onChange={update('confirmPassword')}
              placeholder="Repeat your password"
              type="password"
              className="w-full dark:placeholder:text-gray-400"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-[12px]">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Terms */}
          <div className="flex flex-col gap-1">
            <div className="flex flex-row gap-[10px] items-center">
              <SwitchComponent onChange={setAcceptedTerms} />
              <span className="font-helvetica text-[12px] leading-[18px] dark:text-gray-400 select-none">
                I accept the{' '}
                <Link href="/terms" className="text-teal-400 hover:underline">
                  Terms &amp; Conditions
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-teal-400 hover:underline">
                  Privacy Policy
                </Link>
              </span>
            </div>
            {errors.terms && <p className="text-red-500 text-[12px]">{errors.terms}</p>}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <button
            type="submit"
            disabled={loading}
            className="bg-teal-400 border border-teal-400 p-3.5 rounded-2xl text-white font-helvetica font-bold text-[10px] leading-[15px] w-full hover:bg-transparent hover:text-teal-400 hover:border-teal-400 transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? 'Creating account…' : 'CREATE ACCOUNT'}
          </button>
          <p className="font-helvetica leading-5 text-gray-400 text-[14px] text-center">
            Already have an account?{' '}
            <Link href="login" className="text-teal-400 font-bold hover:text-teal-600 transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}