'use client'

import Image from "next/image";
import { Heart } from "lucide-react";
import { Itinerary } from "../dashboard/page";

interface ItinerariesListSectionProps{
    itineraries: Itinerary[];
    isFavorite: (itineraryId: string) => boolean;
    toggleFavorite: (itineraryId: string) => Promise<void>;
    setIsNewItineraryOpen: (isOpen: boolean) => void;
}

export default function ItineraryListSection({
    itineraries,
    isFavorite,
    toggleFavorite,
    setIsNewItineraryOpen
}: ItinerariesListSectionProps) {
    
    return (
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Your Itineraries</h2>
            {itineraries.length > 0 ? (
                itineraries.map((itinerary) => (
                    <div
                        key={itinerary.id}
                        className="flex items-center space-x-4 mb-4"
                    >
                        <Image
                            src={itinerary.imageUrl}
                            alt={itinerary.destination}
                            width={200}
                            height={200}
                            className="rounded-lg object-cover w-24 h-24 md:w-32 md:h-32"
                        />
                        <div className="flex-1">
                            <h2 className="font-semibold text-lg">
                                Trip: {itinerary.title}
                            </h2>
                            <h3 className="font-medium text-md">
                                Destination: {itinerary.destination}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                Trip Type: {itinerary.tripType}
                            </p>
                            {itinerary.activity && (
                                <>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                                        Date: {itinerary.activity.date}
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                                        Activity:
                                        {itinerary.activity.description ||
                                            "Not provided"}
                                    </p>
                                </>
                            )}
                        </div>
                        <button
                            onClick={() => toggleFavorite(itinerary.id)}
                            className={`hover:text-red-700 transition-colors duration-200 p-2 rounded-full`}
                            title={
                                isFavorite(itinerary.id)
                                    ? "Remove from Favorites"
                                    : "Add to Favorites"
                            }
                        >
                            <Heart
                                className={`h-6 w-6 ${
                                    isFavorite(itinerary.id)
                                        ? "fill-red-500 text-red-500"
                                        : "text-gray-500"
                                }`}
                            />
                        </button>
                    </div>
                ))
            ) : (
                <p className="text-gray-500 dark:text-gray-400">
                    No itineraries found. Create your first itinerary!
                </p>
            )}

            <button
                onClick={() => setIsNewItineraryOpen(true)}
                className="text-[#6d71f9] hover:underline mt-4"
            >
                Create New Itinerary
            </button>
        </section>
    );
};