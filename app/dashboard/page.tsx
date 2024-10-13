"use client"
//app/dashboard/page.tsx
import { useState, useEffect, FormEvent } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Sun, Moon, Search, User, Heart, LogOut, Plus, MapPin, Calendar } from 'lucide-react'
import { toast, Toaster } from 'sonner'
import NewItineraryPopup from '../components/NewItineraryPopup'
import FavoritesPopup from '../components/FavoritesPopup'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '../../firebase/firebaseConfig'
import { useRouter } from 'next/navigation'
import axios from 'axios'

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
    const [isDarkMode, setIsDarkMode] = useState(false)
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
    const [isNewItineraryOpen, setIsNewItineraryOpen] = useState(false)
    const [isFavoritesPopupOpen, setIsFavoritesPopupOpen] = useState(false)
    const [userId, setUserId] = useState<string | null>(null)
    const [itineraries, setItineraries] = useState<Itinerary[]>([]);
    const [userName, setUserName] = useState<string | null>(null);
    const [tripTypeFilter, setTripTypeFilter] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

    // Protected the page from unauthorized access
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                router.push('/authForm?isLogin=true');
            }
        });
        return () => unsubscribe();
    }, [router]);

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

    const fetchItineraries = async () => {
        if (userId) {
            try {
                const response = await axios.get(`/api/itineraries`, {
                    params: {
                        userId,
                        tripType: tripTypeFilter !== 'all' ? tripTypeFilter : undefined,
                        destination: searchQuery.trim() || undefined,
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
    };

    const fetchFavorites = async () => {
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
    };

    useEffect(() => {
        fetchItineraries();
        fetchFavorites();
    }, [userId, tripTypeFilter, searchQuery]);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, [isDarkMode])

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode)
        toast.success(`Switched to ${isDarkMode ? 'light' : 'dark'} mode`)
    }

    const recommendations = [
        { id: 1, destination: 'Tokyo', type: 'Mountains', image: '/images/tokyo.jpg' },
        { id: 2, destination: 'Swiss Alps', type: 'Ski Trip', image: '/images/swiss.jpg' },
        { id: 3, destination: 'New York', type: 'City Break', image: '/images/newyork.jpg' },
    ]

    const filteredItineraries = itineraries.filter(itinerary => {
        const matchesTripType = tripTypeFilter === 'all' || itinerary.tripType === tripTypeFilter;
        return matchesTripType;
    });

    const isFavorite = (itineraryId: string) => {
        return favoriteIds.has(itineraryId);
    }

    const toggleFavorite = async (itineraryId: string) => {
        

        try {
            if (isFavorite(itineraryId)) {
                // Remove from favorites
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
                // Add to favorites
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

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        fetchItineraries();
    };

    return (
        <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>

            <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
                <header className="bg-[#fffefd] dark:bg-[#6d71f9] shadow">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <Link href="/" className="text-3xl font-bold text-[#6d71f9] dark:text-white mb-4 md:mb-0">Triply</Link>

                            <nav className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
                                {/* Search Bar */}
                                <form
                                    onSubmit={handleSearch}
                                    className="flex items-center w-full md:w-auto"
                                >
                                    <input
                                        type="text"
                                        placeholder="Search by destination..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:border-[#6d71f9] dark:bg-gray-700 dark:text-white w-full"
                                    />
                                    <button
                                        type="submit"
                                        title="Search"
                                        className="px-3 py-2 bg-[#6d71f9] text-white rounded-r-md hover:bg-[#575bc4] focus:outline-none"
                                    >
                                        Search
                                    </button>
                                </form>

                                <div className="flex items-center space-x-4">
                                    <button
                                        title="Favorites"
                                        onClick={() => setIsFavoritesPopupOpen(true)} className="p-2 rounded-full hover:bg-white/10">
                                        <Heart
                                            className={`h-5 w-5 ${isFavoritesPopupOpen ? 'text-red-500' : 'text-gray-700'}`}
                                        />
                                    </button>
                                    <button
                                        title="Theme"
                                        onClick={toggleTheme} className="p-2 rounded-full hover:bg-white/10">
                                        {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                                    </button>
                                    <div className="relative">
                                        <button
                                            title="User Menu"
                                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                            className="flex items-center space-x-2 focus:outline-none"
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
                                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1">
                                                <button
                                                    onClick={() => {
                                                        toast.success('Profile clicked')
                                                        setIsUserMenuOpen(false)
                                                    }}
                                                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                                                >
                                                    <User className="inline-block w-4 h-4 mr-2" />
                                                    Profile
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        router.push('/')
                                                        signOut(auth)
                                                        toast.success('Logged out successfully')
                                                        setIsUserMenuOpen(false)
                                                    }}
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
                            refreshItineraries={fetchItineraries}
                        />
                    )}
                    <div className="mb-8 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                        <h1 className="text-3xl font-bold">Welcome back, {userName}</h1>
                        <button
                            onClick={() => setIsNewItineraryOpen(true)}
                            title="New Itinerary"
                            className="mt-4 bg-[#6d71f9] hover:bg-[#575bc4] text-white px-4 py-2 rounded-full transition duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                            <Plus className="h-5 w-5" />
                            <span>New Itinerary</span>
                        </button>
                    </div>

                    {/* Filter and Search Section */}
                    <div className="flex flex-col md:flex-row items-center justify-between mb-6 space-y-4 md:space-y-0">
                        {/* Trip Type Filter */}
                        <div>
                            <label htmlFor="tripType" className="block text-md font-medium text-gray-700 mb-1 dark:text-white">
                                Filter by Trip Type
                            </label>
                            <select
                                id="tripType"
                                value={tripTypeFilter}
                                onChange={(e) => setTripTypeFilter(e.target.value)}
                                className="mt-2 block w-full md:w-46 px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-[#6d71f9] focus:ring-[#6d71f9] dark:bg-gray-800 dark:text-white text-lg transition duration-300 ease-in-out hover:border-[#6d71f9]"
                            >
                                <option value="all">All Trip Types</option>
                                <option value="adventure">Adventure</option>
                                <option value="leisure">Leisure</option>
                                <option value="work">Work</option>
                                <option value="family">Family</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-8">
                            <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-semibold mb-4">Your Itineraries</h2>
                                {filteredItineraries.length > 0 ? (
                                    filteredItineraries.map((itinerary) => (
                                        <div key={itinerary.id} className="flex items-center space-x-4 mb-4">
                                            <Image 
                                                src={itinerary.imageUrl} 
                                                alt={itinerary.destination} 
                                                width={200} 
                                                height={200} 
                                                className="rounded-lg object-cover" 
                                            />
                                            <div className="flex-1">
                                                <h3 className="font-semibold">Trip: {itinerary.title}</h3>
                                                <p className="text-gray-600 dark:text-gray-400">Destination: {itinerary.destination}</p>
                                                <p className='text-gray-600 dark:text-gray-400'> Date: {itinerary.activity?.date} </p>
                                                <p className='text-gray-600 dark:text-gray-400'> Activity: {itinerary.activity?.description} </p>

                                            </div>
                                            <button
                                                onClick={() => toggleFavorite(itinerary.id)}
                                                className={`hover:text-red-700 transition-colors duration-200`}
                                                title={isFavorite(itinerary.id) ? "Remove from Favorites" : "Add to Favorites"}
                                            >
                                                <Heart 
                                                    className={`h-6 w-6 ${isFavorite(itinerary.id) ? 'fill-red-500 text-red-500'  : 'text-gray-500'}`} 
                                                />
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 dark:text-gray-400">No itineraries found. Create your first itinerary!</p>
                                )}
                                <button
                                    onClick={() => setIsNewItineraryOpen(true)}
                                    className="text-[#6d71f9] hover:underline"
                                >
                                    Create New Itinerary
                                </button>
                            </section>

                            <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-semibold mb-4">Recommendations</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {recommendations.map((rec) => (
                                        <div key={rec.id} className="bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                                            <Image 
                                                src={rec.image} 
                                                alt={rec.destination} 
                                                width={200} 
                                                height={100} 
                                                className="w-full h-32 object-cover" 
                                            />
                                            <div className="p-4">
                                                <h3 className="font-semibold">{rec.destination}</h3>
                                                <p className="text-gray-600 dark:text-gray-400">{rec.type}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        <div className="space-y-8">
                            <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                                <div className="space-y-4">
                                    <button
                                        onClick={() => toast.success('Exploring destinations')}
                                        className="w-full border border-[#6d71f9] text-[#A594F9] hover:bg-[#6d71f9] hover:text-white p-2 rounded-md transition duration-300 flex items-center justify-center"
                                    >
                                        <MapPin className="h-5 w-5 mr-2" />
                                        Explore Destinations
                                    </button>
                                    <button
                                        onClick={() => toast.success('Viewing upcoming trips')}
                                        className="w-full border border-[#6d71f9] text-[#A594F9] hover:bg-[#6d71f9] hover:text-white p-2 rounded-md transition duration-300 flex items-center justify-center"
                                    >
                                        <Calendar className="h-5 w-5 mr-2" />
                                        Upcoming Trips
                                    </button>
                                    <button
                                        title="Favorites"
                                        onClick={() => setIsFavoritesPopupOpen(true)}
                                        className="w-full border border-[#6d71f9] text-[#A594F9] hover:bg-[#6d71f9] hover:text-white p-2 rounded-md transition duration-300 flex items-center justify-center"
                                    >
                                        <Heart className="h-5 w-5 mr-2" />
                                        Favorites
                                    </button>
                                </div>
                            </section>

                            <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-semibold mb-4">Travel Stats</h2>
                                <div className="space-y-2">
                                    <p>Total Trips: 12</p>
                                    <p>Countries Visited: 8</p>
                                    <p>Upcoming Trips: 2</p>
                                </div>
                            </section>
                        </div>
                    </div>
                </main>
            </div>
            <Toaster />
        </div>
    )
}