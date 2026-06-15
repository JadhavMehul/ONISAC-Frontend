'use client';
import InputComponent from '@components/global/InputComponent';
import SwitchComponent from '@components/global/SwitchComponent';
import { useAuth } from '@context/AuthContext';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface FormErrors {
  email?: string;
  password?: string;
}

export default function LoginContainer() {
  const { login, loading } = useAuth();
  const searchParams = useSearchParams();

  const [data, setData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      toast.success('Account created! Please verify your email, then sign in.');
    }
  }, [searchParams]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!data.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = 'Enter a valid email address.';
    }
    if (!data.password) {
      newErrors.password = 'Password is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await login(data.email, data.password);
    } catch {
      // error toast handled in AuthContext
    }
  };

  return (
    <div className="flex flex-row dark:bg-[#0a0a0a] min-h-screen">
      {/* Form panel */}
      <div className="bg-white dark:bg-[#353535] w-full md:w-[55%] flex items-center min-h-screen px-6">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-9 w-full max-w-[350px] mx-auto"
        >
          <div>
            <h1 className="font-bold text-teal-400 text-3xl font-helvetica leading-9 mb-2">
              Welcome Back
            </h1>
            <p className="font-helvetica font-bold leading-5 text-gray-400 text-[14px]">
              Enter your credentials to sign in
            </p>
          </div>

          <div className="flex flex-col gap-6">
            {/* Email */}
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-gray-700 text-[14px] font-helvetica leading-5 dark:text-gray-400">
                Email
              </label>
              <InputComponent
                value={data.email}
                onChange={(e) => {
                  setData({ ...data, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: undefined });
                }}
                placeholder="you@example.com"
                type="email"
                className="w-full dark:placeholder:text-gray-400 dark:text-gray-400"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <p id="email-error" className="text-red-500 text-[12px] mt-0.5">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="text-gray-700 text-[14px] font-helvetica leading-5 dark:text-gray-400">
                Password
              </label>
              <InputComponent
                value={data.password}
                onChange={(e) => {
                  setData({ ...data, password: e.target.value });
                  if (errors.password) setErrors({ ...errors, password: undefined });
                }}
                placeholder="Your password"
                type="password"
                className="w-full dark:placeholder:text-gray-400 dark:text-gray-400"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'password-error' : undefined}
              />
              {errors.password && (
                <p id="password-error" className="text-red-500 text-[12px] mt-0.5">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember me */}
            <div className="flex flex-row gap-[10px] items-center">
              <SwitchComponent onChange={setRememberMe} />
              <span className="font-helvetica text-[12px] leading-[18px] dark:text-gray-400 select-none">
                Remember me
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <button
              type="submit"
              disabled={loading}
              className="bg-teal-400 border border-teal-400 p-3.5 rounded-2xl text-white font-helvetica font-bold text-[10px] leading-[15px] w-full hover:bg-transparent hover:text-teal-400 hover:border-teal-400 transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? 'Signing in…' : 'SIGN IN'}
            </button>
            <p className="font-helvetica leading-5 text-gray-400 text-[14px] text-center">
              Don't have an account?{' '}
              <Link href="register" className="text-teal-400 font-bold hover:text-teal-600 transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>

      {/* Decorative panel */}
      <div
        className="hidden md:block w-[45%] bg-teal-400 bg-auto bg-center dark:bg-[#0a0a0a]"
        style={{ backgroundImage: "url('/assets/images/pattern.png')" }}
        aria-hidden="true"
      />
    </div>
  );
}