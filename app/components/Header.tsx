import React, { FormEvent } from 'react';
import Link from 'next/link';

interface HeaderProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    handleSearch: (e: FormEvent) => void;
}

const Header: React.FC<HeaderProps> = ({ searchQuery, setSearchQuery, handleSearch }) => {
    return (
        <header className="bg-[#fffefd] dark:bg-[#6d71f9] shadow">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link href="/" className="text-3xl font-bold text-[#6d71f9] dark:text-white">
                    Triply
                </Link>

                <nav className="flex items-center space-x-4">
                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="flex items-center">
                        <input
                            type="text"
                            placeholder="Search by destination..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:border-[#6d71f9] dark:bg-gray-700 dark:text-white"
                        />
                        <button
                            type="submit"
                            title="Search"
                            className="px-3 py-2 bg-[#6d71f9] text-white rounded-r-md hover:bg-[#575bc4] focus:outline-none"
                        >
                            Search
                        </button>
                    </form>
                    
                </nav>
            </div>
        </header>
    );
};

export default Header;