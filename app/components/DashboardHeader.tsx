"use client";

import Link from "next/link";
import Image from "next/image";
import { Sun, Moon, User, Heart, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { toast } from "sonner";

interface DashboardHeaderProps {
    isDarkMode: boolean;
    toggleTheme: () => void;
    isUserMenuOpen: boolean;
    setIsUserMenuOpen: (isOpen: boolean) => void;
    isFavoritesPopupOpen: boolean;
    setIsFavoritesPopupOpen: (isOpen: boolean) => void;
}

export default function DashboardHeader({
    isDarkMode,
    toggleTheme,
    isUserMenuOpen,
    setIsUserMenuOpen,
    isFavoritesPopupOpen,
    setIsFavoritesPopupOpen,
}: DashboardHeaderProps) {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            toast.success("Logged out successfully");
            setIsUserMenuOpen(false);
            router.push("/authForm?isLogin=true");
        } catch (error) {
            console.error("Error signing out: ", error);
            toast.error("Failed to log out.");
        }
    };

    return (
        <header className="bg-[#fffefd] dark:bg-[#6d71f9] shadow">
            <div className="container mx-auto px-4 py-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <Link
                        href="/"
                        className="text-3xl font-bold text-[#6d71f9] dark:text-white mb-4 md:mb-0"
                    >
                        Triply
                    </Link>
                    <nav className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
                        <div className="flex items-center space-x-4">
                            <button
                                title="Favorites"
                                onClick={() => setIsFavoritesPopupOpen(true)}
                                className="p-2 rounded-full hover:bg-white/10"
                            >
                                <Heart
                                    className={`h-8 w-6 ${
                                        isFavoritesPopupOpen
                                            ? "text-red-500"
                                            : "text-gray-700"
                                    }`}
                                />
                            </button>
                            <button
                                title="Theme"
                                onClick={toggleTheme}
                                className="p-2 rounded-full hover:bg-white/10"
                            >
                                {isDarkMode ? (
                                    <Sun className="h-8 w-6" />
                                ) : (
                                    <Moon className="h-8 w-6" />
                                )}
                            </button>
                            <div className="relative">
                                <button
                                    title="User Menu"
                                    onClick={() =>
                                        setIsUserMenuOpen(!isUserMenuOpen)
                                    }
                                    className="p-2 rounded-full hover:bg-white/10 flex items-center justify-center"
                                >
                                    <Image
                                        src="/images/boy.png"
                                        width={32}
                                        height={32}
                                        alt="User avatar"
                                        className="rounded-full"
                                    />
                                </button>
                                {isUserMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50">
                                        <button
                                            onClick={() => {
                                                toast.success(
                                                    "Profile clicked"
                                                );
                                                setIsUserMenuOpen(false);
                                            }}
                                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                                        >
                                            <User className="inline-block w-4 h-4 mr-2" />
                                            Profile
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                                        >
                                            <LogOut className="inline-block w-4 h-4 mr-2" />
                                            Log out
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    );
}
