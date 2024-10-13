"use client"

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'


export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white text-black">
            <header className="container mx-auto px-4 py-6">
                <nav className="flex justify-between items-center">
                    <Link href="/" className="text-2xl font-bold text-[#A594F9]">Triply</Link>
                    <div className="space-x-4">

                        <Link href="/authForm?isLogin=true">Login</Link>
                        <Link href="/authForm?isLogin=false">Sign Up</Link>

                    </div>
                </nav>
            </header>

            <main className="container mx-auto px-4 py-12">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                    <div className="lg:w-1/2 space-y-8">
                        <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                            Plan Your <span className="text-[#A594F9]">Perfect Trip</span> with Ease
                        </h1>
                        <p className="text-xl text-gray-600">
                            Create, organize, and share your travel itineraries all in one place.
                        </p>
                        <Link href="/authForm?isLogin=false"
                            
                            className="bg-[#A594F9] hover:bg-[#CDC1FF] text-white flex items-center px-4 py-2 rounded-md transition duration-200">
                            Get Started
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </div>

                    <div className="lg:w-1/3">
                        <Image
                            src="/images/redd-f-Bxzrd0p6yOM-unsplash.jpg"
                            alt="Modern travel illustration"
                            width={600}
                            height={600}
                            className="rounded-full shadow-2xl"
                        />
                    </div>
                    

                </div>
            </main>

            <section className="bg-[#CDC1FF] py-24 mt-24">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold mb-8">Start Your Journey Today</h2>
                    <button  className="bg-[#A594F9] hover:bg-white hover:text-[#A594F9] text-white">
                        Create Your First Itinerary
                    </button>
                </div>
            </section>

            <footer className="bg-white mt-24">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-600 mb-4 md:mb-0">&copy; 2024 Triply. All rights reserved.</p>
                        <div className="space-x-4">
                            <Link href="/privacy" className="text-gray-600 hover:text-[#A594F9] transition-colors">
                                Privacy Policy
                            </Link>
                            <Link href="/terms" className="text-gray-600 hover:text-[#A594F9] transition-colors">
                                Terms of Service
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}