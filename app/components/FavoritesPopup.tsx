import React, { useEffect, useState } from 'react';
import { Itinerary } from '../dashboard/page'; 
import Image from 'next/image';
import axios from 'axios';
import { toast } from 'sonner';
import { Heart } from 'lucide-react';

interface FavoritesPopupProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string | null;
    refreshItineraries: () => void;
}

const FavoritesPopup: React.FC<FavoritesPopupProps> = ({ isOpen, onClose, userId, refreshItineraries }) => {
    const [favorites, setFavorites] = useState<Itinerary[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchFavorites = async () => {
        if (!userId) return;
        setIsLoading(true);
        try {
            const response = await axios.get('/api/favorites', {
                params: { userId },
            });
            if (response.data.success) {
                setFavorites(response.data.itineraries);
            } else {
                toast.error(response.data.message || 'Failed to fetch favorites.');
            }
        } catch (error) {
            console.error('Error fetching favorites:', error);
            toast.error('An error occurred while fetching favorites.');
        } finally {
            setIsLoading(false);
        }
    };

    const removeFavorite = async (itineraryId: string) => {
        if (!userId) return;
        try {
            const response = await axios.delete('/api/favorites', {
                data: { userId, itineraryId },
            });
            if (response.data.success) {
                toast.success('Removed from favorites.');
                fetchFavorites();
                refreshItineraries();
            } else {
                toast.error(response.data.message || 'Failed to remove favorite.');
            }
        } catch (error) {
            console.error('Error removing favorite:', error);
            toast.error('An error occurred while removing favorite.');
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchFavorites();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Your Favorites</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white">
                        &times;
                    </button>
                </div>
                <div className="p-4">
                    {isLoading ? (
                        <p className="text-center text-gray-500 dark:text-gray-400">Loading favorites...</p>
                    ) : favorites.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {favorites.map((itinerary) => (
                                <div key={itinerary.id} className="bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden shadow">
                                    <Image
                                        src={itinerary.imageUrl}
                                        alt={itinerary.destination}
                                        width={400}
                                        height={200}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{itinerary.title}</h3>
                                        <p className="text-gray-600 dark:text-gray-300">{itinerary.destination}</p>
                                        <p className="text-gray-600 dark:text-gray-300">{itinerary.tripType}</p>
                                        <button
                                            onClick={() => removeFavorite(itinerary.id)}
                                            className="mt-2 flex items-center text-red-500 hover:text-red-700"
                                        >
                                            <Heart className="h-5 w-5 mr-1" /> Remove Favorite
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400">You have no favorite itineraries.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FavoritesPopup;