// import React from 'react';
// import Image from 'next/image';
// import { Heart } from 'lucide-react';

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

// interface ItineraryCardProps {
//     itinerary: Itinerary;
//     isFavorite: (id: string) => boolean;
//     toggleFavorite: (id: string) => void;
// }

// const ItineraryCard: React.FC<ItineraryCardProps> = ({ itinerary, isFavorite, toggleFavorite }) => {
//     return (
//         <div className="flex items-center space-x-4 mb-4">
//             <Image
//                 src={itinerary.imageUrl}
//                 alt={itinerary.destination}
//                 width={200}
//                 height={200}
//                 className="rounded-lg object-cover"
//             />
//             <div className="flex-1">
//                 <h3 className="font-semibold">Trip: {itinerary.title}</h3>
//                 <p className="text-gray-600 dark:text-gray-400">Destination: {itinerary.destination}</p>
                
//                 <p className='text-gray-600 dark:text-gray-400'>Date: {itinerary.activity?.date}</p>
//                 <p className='text-gray-600 dark:text-gray-400'>Activity: {itinerary.activity?.description}</p>


//             </div>
//             <button
//                 onClick={() => toggleFavorite(itinerary.id)}
//                 className={`hover:text-red-700 transition-colors duration-200`}
//                 title={isFavorite(itinerary.id) ? "Remove from Favorites" : "Add to Favorites"}
//             >
//                 <Heart
//                     className={`h-6 w-6 ${isFavorite(itinerary.id) ? 'fill-red-500 text-red-500' : 'text-gray-500'}`}
//                 />
//             </button>
//         </div>
//     );
// };

// export default ItineraryCard;