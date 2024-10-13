import React from 'react';

const TravelStats: React.FC = () => {
    return (
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Travel Stats</h2>
            <div className="space-y-2">
                <p>Total Trips: 12</p>
                <p>Countries Visited: 8</p>
                <p>Upcoming Trips: 2</p>
            </div>
        </section>
    );
};

export default TravelStats;