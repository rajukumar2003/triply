import React from 'react';

interface FiltersProps {
    tripTypeFilter: string;
    setTripTypeFilter: (filter: string) => void;
}

const Filters: React.FC<FiltersProps> = ({ tripTypeFilter, setTripTypeFilter }) => {
    return (
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
                    className="mt-1 block w-full md:w-48 rounded-md border-gray-300 shadow-sm focus:border-[#6d71f9] focus:ring-[#6d71f9] dark:bg-gray-800 dark:text-white"
                >
                    <option value="all">All</option>
                    <option value="adventure">Adventure</option>
                    <option value="leisure">Leisure</option>
                    <option value="work">Work</option>
                </select>
            </div>
        </div>
    );
};

export default Filters;