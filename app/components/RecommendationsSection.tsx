"use client";

import Image from "next/image";

interface Recommendation {
    id: number;
    destination: string;
    type: string;
    image: string;
}

interface RecommendationsSectionProps {
    recommendations: Recommendation[];
}

export default function RecommendationsSection({
    recommendations,
}: RecommendationsSectionProps) {
    return (
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Recommendations</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendations.map((rec) => (
                    <div
                        key={rec.id}
                        className="bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden"
                    >
                        <Image
                            src={rec.image}
                            alt={rec.destination}
                            width={200}
                            height={100}
                            className="w-full h-32 object-cover"
                        />
                        <div className="p-4">
                            <h3 className="font-semibold">{rec.destination}</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                {rec.type}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
