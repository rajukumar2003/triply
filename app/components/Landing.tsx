import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, MapPin, Calendar, Share2 } from 'lucide-react';

const LandingPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-white text-black">
            <header className="container mx-auto px-4 py-6">
                <nav className="flex justify-between items-center">
                    <Link href="/" className="text-3xl font-bold text-[#A594F9] transition-colors hover:text-[#CDC1FF]">
                        Triply
                    </Link>
                    <div className="space-x-4">
                        <Link href="/authForm?isLogin=true" className="text-gray-600 hover:text-[#A594F9] transition-colors">
                            Login
                        </Link>
                        <Link
                            href="/authForm?isLogin=false"
                            className="bg-[#A594F9] hover:bg-[#CDC1FF] text-white px-4 py-2 rounded-md transition duration-200"
                        >
                            Sign Up
                        </Link>
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
                        <Link
                            href="/authForm?isLogin=false"
                            className="inline-flex items-center bg-[#A594F9] hover:bg-[#CDC1FF] text-white px-6 py-3 rounded-md transition duration-200 transform hover:scale-105"
                        >
                            Get Started
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </div>

                    <div className="lg:w-1/2 relative">
                        <div className="absolute -top-4 -left-4 w-full h-full bg-[#CDC1FF] rounded-full"></div>
                        <Image
                            src="/images/japan.jpg"
                            alt="Traveler with a backpack"
                            width={600}
                            height={600}
                            className="rounded-full shadow-2xl relative z-10 transition-transform duration-300 hover:scale-105"
                        />
                    </div>
                </div>
            </main>

            <section className="py-24 bg-[#F3F0FF]">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold mb-12 text-center">Discover Amazing Destinations</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { src: "/images/bali.jpg", alt: "Bali", title: "Mountain Adventures" },
                            { src: "/images/newyork.jpg", alt: "City skyline", title: "City Exploration" },
                            { src: "/images/tokyo.jpg", alt: "Tokyo", title: "Urban Exploration" },
                        ].map((image, index) => (
                            <div key={index} className="group relative overflow-hidden rounded-lg shadow-lg">
                                <Image
                                    src={image.src}
                                    alt={image.alt}
                                    width={400}
                                    height={300}
                                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <h3 className="absolute bottom-4 left-4 text-white text-xl font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    {image.title}
                                </h3>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-24">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold mb-12 text-center">Why Choose Triply?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: MapPin, title: 'Discover', description: 'Find hidden gems and popular attractions' },
                            { icon: Calendar, title: 'Plan', description: 'Create detailed itineraries with ease' },
                            { icon: Share2, title: 'Share', description: 'Collaborate with friends and family' },
                        ].map((feature, index) => (
                            <div key={index} className="bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl">
                                <feature.icon className="w-12 h-12 text-[#A594F9] mb-4" />
                                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-24 bg-[#CDC1FF]">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="md:w-1/2">
                            <h2 className="text-4xl font-bold mb-6">Start Your Journey Today</h2>
                            <p className="text-xl mb-8">Create unforgettable memories with Triply easy-to-use travel planning tools.</p>
                            <Link
                                href="/authForm?isLogin=false"
                                className="inline-block bg-[#A594F9] hover:bg-white hover:text-[#A594F9] text-white px-8 py-4 rounded-md transition duration-200 transform hover:scale-105"
                            >
                                Create Your First Itinerary
                            </Link>
                        </div>
                        <div className="md:w-1/2 relative">
                            <div className="absolute -top-4 -right-4 w-full h-full bg-[#A594F9] rounded-lg transform rotate-3"></div>
                            <Image
                                src="/images/swiss.jpg"
                                alt="Travel planning"
                                width={600}
                                height={300}
                                className="rounded-lg shadow-2xl relative z-10"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <footer className="bg-white py-12">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-8 md:mb-0">
                            <Link href="/" className="text-2xl font-bold text-[#A594F9]">Triply</Link>
                            <p className="text-gray-600 mt-2">&copy; 2024 Triply. All rights reserved.</p>
                        </div>
                        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8">
                            <Link href="/about" className="text-gray-600 hover:text-[#A594F9] transition-colors">About Us</Link>
                            <Link href="/contact" className="text-gray-600 hover:text-[#A594F9] transition-colors">Contact</Link>
                            <Link href="/privacy" className="text-gray-600 hover:text-[#A594F9] transition-colors">Privacy Policy</Link>
                            <Link href="/terms" className="text-gray-600 hover:text-[#A594F9] transition-colors">Terms of Service</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;