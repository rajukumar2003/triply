// import React from 'react';
// import ItineraryCard from './ItineraryCard';

// interface Itinerary {
//     id: string;
//     title: string;
//     destination: string;
//     tripType: string;
//     imageUrl: string;
//     activity: {
//         date: string;
//         description: string;
//         destination: string;
//     }[];
// }

// interface ItinerariesListProps {
//     itineraries: Itinerary[];
//     favoriteIds: Set<string>;
//     toggleFavorite: (id: string) => void;
// }

// const ItinerariesList: React.FC<ItinerariesListProps> = ({ itineraries, favoriteIds, toggleFavorite }) => {
//     const isFavorite = (id: string): boolean => {
//         return favoriteIds.has(id);
//     };

//     return (
//         <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
//             <h2 className="text-xl font-semibold mb-4">Your Itineraries</h2>
//             {itineraries.length > 0 ? (
//                 itineraries.map((itinerary) => (
//                     <ItineraryCard
//                         key={itinerary.id}
//                         itinerary={itinerary}
//                         isFavorite={isFavorite}
//                         toggleFavorite={toggleFavorite}
//                     />
//                 ))
//             ) : (
//                 <p className="text-gray-500 dark:text-gray-400">No itineraries found. Create your first itinerary!</p>
//             )}
//             <button
//                 onClick={() => toggleFavorite(itinerary.id)}
//                 className="text-[#6d71f9] hover:underline"
//             >
//                 Create New Itinerary
//             </button>
//         </section>
//     );
// };

// export default ItinerariesList;