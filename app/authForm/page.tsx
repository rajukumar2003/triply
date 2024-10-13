"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { toast, Toaster } from "sonner";
import { signIn, signUp, signInWithGoogle } from "@/firebase/auth"; // Import your Firebase auth functions
import { useRouter } from "next/navigation";


export default function AuthForm() {
    const searchParams = useSearchParams();
    const isLogin = searchParams.get("isLogin") === "true";
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const router = useRouter();

    const handleGoogleSignIn = async () => {
        try {
            const userCredential = await signInWithGoogle();
            const user = userCredential.user;
            toast.success(`Successfully signed in with Google! Welcome, ${user.displayName}`);
            router.push("/dashboard");
        } catch (error: any) {
            toast.error(`Google Sign-In failed: ${error.message}`);
        }
    };


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (isLogin) {
                // Handle login
                await signIn(email, password);
                toast.success("Successfully signed in!");
                router.push("/dashboard");
            } else {
                // Handle signup
                await signUp(email, password);
                toast.success("Successfully signed up!");
                router.push("/dashboard");
            }
        } catch (error: any) {
            toast.error(`Failed to ${isLogin ? "sign in" : "sign up"}: ${error.message}`);
        }
    };

    return (
        <div className="min-h-screen bg-[#CDC1FF] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-[#A594F9] mb-2">
                    {isLogin ? "Welcome Back" : "Create an Account"}
                </h2>
                <p className="text-gray-600 mb-6">
                    {isLogin ? "Sign in to your account to continue" : "Sign up to start planning your trips"}
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div className="space-y-2">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <input
                                    id="name"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Enter your full name"
                                    className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A594F9]"
                                />
                            </div>
                        </div>
                    )}
                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A594F9]"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder={isLogin ? "Enter your password" : "Create a password"}
                                className="w-full pl-10 pr-10 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A594F9]"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 text-gray-400"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-[#A594F9] hover:bg-[#8A7AD8] text-white p-2 rounded-md transition duration-300"
                    >
                        {isLogin ? "Sign In" : "Sign Up"}
                    </button>
                </form>
                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or continue with</span>
                        </div>
                    </div>
                    <div className="mt-6">
                        <button
                            onClick={handleGoogleSignIn}
                            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                            <Image src="/images/search.png" width={24} height={24} alt="Google logo" className="mr-2" />
                            Sign {isLogin ? "in" : "up"} with Google
                        </button>
                    </div>
                </div>
                <div className="mt-6 text-sm text-center">
                    {isLogin ? (
                        <>
                            <Link href="/forgot-password" className="text-[#A594F9] hover:underline">
                                Forgot password?
                            </Link>
                            <span className="mx-2">•</span>
                            <Link href="/authForm?isLogin=false" className="text-[#A594F9] hover:underline">
                                Don't have an account? Sign up
                            </Link>
                        </>
                    ) : (
                        <p>
                            Already have an account?{" "}
                            <Link href="/authForm?isLogin=true" className="text-[#A594F9] hover:underline">
                                Sign in
                            </Link>
                        </p>
                    )}
                </div>
            </div>
            <Toaster />
        </div>
    );
}
