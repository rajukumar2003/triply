import React from 'react';
import { MapPin, Calendar, Heart } from 'lucide-react';
import { toast } from 'sonner';

interface QuickActionsProps {
    openFavorites: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ openFavorites }) => {
    return (
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
                    onClick={openFavorites}
                    className="w-full border border-[#6d71f9] text-[#A594F9] hover:bg-[#6d71f9] hover:text-white p-2 rounded-md transition duration-300 flex items-center justify-center"
                >
                    <Heart className="h-5 w-5 mr-2" />
                    Favorites
                </button>
            </div>
        </section>
    );
};

export default QuickActions;