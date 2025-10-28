'use client';

import { useEffect, useRef, useState } from 'react';
import { Zap, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Input from "@workspace/ui/components/Input"
import {cn} from "@workspace/ui/lib/utils"
const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log({ email, password, rememberMe });
    };

    const Inputref = useRef<HTMLInputElement>(null);
    useEffect(() => {
        if (Inputref.current) {
            Inputref.current.focus();
        }
    }, [])

    return (
        <div className="min-h-screen bg-[var(--bg)] to-gray-100 flex flex-col items-center justify-center p-4 md:p-8 relative">
            <div className='w-full max-w-7xl flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 mb-20 md:mb-0'>
                <div className=" w-full flex justify-center overflow-hidden items-center">
                    <div className={cn("bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:10px_10px] w-full max-w-md bg-white/80 rounded-sm shadow-[var(--shadow-lg)] border border-gray-100 p-8 md:p-10")}>
                        <div className="flex flex-col items-center mb-8">
                            <div className="w-14 h-14 bg-gradient-to-br from-neutral-900 to-neutral-700 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                                <Zap className="w-7 h-7 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold text-neutral-900 mb-2 tracking-tight">
                                Welcome back!
                            </h1>
                            <p className="text-sm text-neutral-600 text-center">
                                Sign in to your account to continue
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="relative group">
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    ref={Inputref}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 focus:border-neutral-900 transition-all rounded-xl text-base"
                                />
                            </div>

                            <div className="relative group">

                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-12 pr-12 py-3.5 bg-white border-2 border-gray-200 focus:border-neutral-900 transition-all rounded-xl text-base"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400  transition-colors p-1 rounded-lg "
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>

                            <div className="flex items-center justify-between pt-1 px-1/2">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="w-4 h-4 rounded border-gray-300 text-neutral-900 focus:ring-neutral-900 cursor-pointer"
                                    />
                                    <span className="text-sm text-neutral-600 group-hover:text-neutral-900 transition-colors">
                                        Remember me
                                    </span>
                                </label>
                                <button
                                    type="button"
                                    className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors font-medium"
                                >
                                    Forgot password?
                                </button>
                            </div>

                            <button
                                type="submit"
                                className="w-full cursor-pointer px-1 py-3 bg-neutral-900  active:scale-[0.98] text-white rounded-xl font-semibold transition-all duration-200 shadow-[10px_0px_10px_0px_10px] mt-6"
                            >
                                Sign In
                            </button>
                        </form>

                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm ">
                                <span className="px-4 py-1 bg-white rounded-full text-neutral-500  font-medium">
                                    Or signin with
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                className="px-4 cursor-pointer py-3 flex items-center justify-center gap-3 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 active:scale-[0.98] transition-all shadow-sm font-medium text-neutral-700 group"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path
                                        fill="#4285F4"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="#34A853"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="#FBBC05"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="#EA4335"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                <span className="text-sm font-medium text-neutral-700 group-hover:text-neutral-900">
                                    Google
                                </span>
                            </button>
                            <button
                                type="button"
                                className="px-4 cursor-pointer py-3 flex items-center justify-center gap-3 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 active:scale-[0.98] transition-all shadow-sm font-medium text-neutral-700 group"
                            >
                                <svg
                                    className="w-5 h-5"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                                </svg>
                                <span className="text-sm font-medium text-neutral-700 group-hover:text-neutral-900">
                                    Apple
                                </span>
                            </button>
                        </div>

                        <div className="mt-8 text-center flex justify-between items-center">
                            <p className="text-sm text-neutral-600">
                                Don't have an account?{' '}
                            </p>
                            <button className=" underline text-neutral-900 font-semibold cursor-pointer text-md hover:text-neutral-700 transition-colors underline-offset-4 hover:underline">
                                Sign up
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage