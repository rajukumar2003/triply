"use client"

import { useState, useEffect, useCallback } from 'react'

import { Plus, Heart, MapPin, Calendar } from 'lucide-react'
import { toast, Toaster } from 'sonner'
import NewItineraryPopup from '../components/NewItineraryPopup'
import FavoritesPopup from '../components/FavoritesPopup'
import DashboardHeader from "../components/DashboardHeader";
import ItineraryListSection from "../components/ItineraryListSection";
import RecommendationsSection from "../components/RecommendationsSection";
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../../firebase/firebaseConfig'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import {useTheme} from '../context/ThemeContext'

export interface Itinerary {
    id: string;
    title: string;
    destination: string;
    tripType: string;
    imageUrl: string;
    activity: {
        date: string;
        description: string;
        destination: string;
    }[];
}

export default function Dashboard() {
    const router = useRouter();
    const { isDarkMode, toggleTheme } = useTheme();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
    const [isNewItineraryOpen, setIsNewItineraryOpen] = useState(false)
    const [isFavoritesPopupOpen, setIsFavoritesPopupOpen] = useState(false)
    const [userId, setUserId] = useState<string | null>(null)
    const [itineraries, setItineraries] = useState<Itinerary[]>([]);
    const [userName, setUserName] = useState<string | null>(null);
    const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

    // Protection from unauthorized access
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                router.push('/authForm?isLogin=true');
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
                setUserName(user.displayName || "User");
            } else {
                setUserId(null);
                setUserName(null);
            }
        });
        return () => unsubscribe();
    }, []);

    const fetchItineraries = useCallback(async () => {
        if (userId) {
            try {
                const response = await axios.get(`/api/itineraries`, {
                    params: {
                        userId,
                    },
                });
                if (response.data.success) {
                    setItineraries(response.data.itineraries);
                }
            } catch (error) {
                console.error('Error fetching itineraries:', error);
                toast.error('Failed to fetch itineraries');
            }
        }
    }, [userId]);

    const fetchFavorites = useCallback(async () => {
        if (userId) {
            try {
                const response = await axios.get('/api/favorites', {
                    params: { userId },
                });
                if (response.data.success) {
                    const ids = new Set(response.data.itineraries.map((it: Itinerary) => it.id));
                    setFavoriteIds(ids as Set<string>);
                } else {
                    toast.error(response.data.message || 'Failed to fetch favorites.');
                }
            } catch (error) {
                console.error('Error fetching favorites:', error);
                toast.error('An error occurred while fetching favorites.');
            }
        }
    }, [userId]);

    useEffect(() => {
        if (userId) {
            fetchItineraries();
            fetchFavorites();
        }
    }, [userId, fetchItineraries, fetchFavorites]);

    const recommendationsData = [
        { id: 1, destination: 'Tokyo', type: 'Mountains', image: '/images/tokyo.jpg' },
        { id: 2, destination: 'Swiss Alps', type: 'Ski Trip', image: '/images/swiss.jpg' },
        { id: 3, destination: 'New York', type: 'City Break', image: '/images/newyork.jpg' },
    ]

    const isFavorite = (itineraryId: string) => {
        return favoriteIds.has(itineraryId);
    }

    const toggleFavorite = async (itineraryId: string) => {
        try {
            if (isFavorite(itineraryId)) {
                const response = await axios.delete('/api/favorites', {
                    data: { userId, itineraryId },
                });
                if (response.data.success) {
                    toast.success('Removed from favorites.');
                    setFavoriteIds(prev => {
                        const updated = new Set(prev);
                        updated.delete(itineraryId);
                        return updated;
                    });
                } else {
                    toast.error(response.data.message || 'Failed to remove favorite.');
                }
            } else {
                const response = await axios.post('/api/favorites', { userId, itineraryId });
                if (response.data.success) {
                    toast.success('Added to favorites.');
                    setFavoriteIds(prev => new Set(prev).add(itineraryId));
                } else {
                    toast.error(response.data.message || 'Failed to add favorite.');
                }
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
            toast.error('An error occurred while updating favorites.');
        }
    };

    return (
        <div className={`min-h-screen `}>
            <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
                <DashboardHeader
                    isDarkMode={isDarkMode}
                    toggleTheme={toggleTheme}
                    isUserMenuOpen={isUserMenuOpen}
                    setIsUserMenuOpen={setIsUserMenuOpen}
                    isFavoritesPopupOpen={isFavoritesPopupOpen}
                    setIsFavoritesPopupOpen={setIsFavoritesPopupOpen}
                />

                <main className="container mx-auto px-4 py-8">
                    {isNewItineraryOpen && (
                        <NewItineraryPopup
                            isOpen={isNewItineraryOpen}
                            onClose={() => setIsNewItineraryOpen(false)}
                            refreshItineraries={fetchItineraries}
                        />
                    )}
                    {isFavoritesPopupOpen && (
                        <FavoritesPopup
                            isOpen={isFavoritesPopupOpen}
                            onClose={() => setIsFavoritesPopupOpen(false)}
                            userId={userId}
                            refreshItineraries={fetchFavorites}
                        />
                    )}
                    <div className="mb-8 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                        <h1 className="text-3xl font-bold">
                            Welcome back, {userName || "User"}
                        </h1>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-8">
                            <ItineraryListSection
                                itineraries={itineraries}
                                isFavorite={isFavorite}
                                toggleFavorite={toggleFavorite}
                                setIsNewItineraryOpen={setIsNewItineraryOpen}
                            />
                            <RecommendationsSection
                                recommendations={recommendationsData}
                            />
                        </div>

                        <div className="space-y-8">
                            {/* Quick Actions Section */}
                            <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-semibold mb-4">
                                    Quick Actions
                                </h2>
                                <div className="space-y-4">
                                    <button
                                        onClick={() =>
                                            setIsNewItineraryOpen(true)
                                        }
                                        className="w-full border border-[#6d71f9] text-[#A594F9] hover:bg-[#6d71f9] hover:text-white p-2 rounded-md transition duration-300 flex items-center justify-center"
                                    >
                                        <Plus className="h-5 w-5 mr-2" />
                                        Create Itinerary
                                    </button>
                                    <button
                                        title="Favorites"
                                        onClick={() =>
                                            setIsFavoritesPopupOpen(true)
                                        }
                                        className="w-full border border-[#6d71f9] text-[#A594F9] hover:bg-[#6d71f9] hover:text-white p-2 rounded-md transition duration-300 flex items-center justify-center"
                                    >
                                        <Heart className="h-5 w-5 mr-2" />
                                        Favorites
                                    </button>
                                </div>
                            </section>

                            {/* Travel Stats Section */}
                            <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-semibold mb-4">
                                    Travel Stats
                                </h2>
                                <div className="space-y-2">
                                    <p>Total Trips: {itineraries.length}</p>
                                    <p>
                                        Countries Visited:{" ..."}
                                    </p>
                                    <p>
                                        Upcoming Trips:{" ..."}
                                    </p>
                                </div>
                            </section>
                        </div>
                    </div>
                </main>
            </div>
            <Toaster />
        </div>
    );
}