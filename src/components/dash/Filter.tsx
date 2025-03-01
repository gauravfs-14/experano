import React, { useState } from 'react';
import { Filter as FilterIcon, MapPin } from "lucide-react";

const Filter = () => {
  const [location, setLocation] = useState('');

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation(`${position.coords.latitude}, ${position.coords.longitude}`);
      });
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 dark:text-white flex items-center">
        <FilterIcon className="mr-2" /> Filters
      </h2>
      
      {/* Date Filter */}
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2 dark:text-gray-300">Date</h3>
        <select className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white">
          <option>Any Date</option>
          <option>Today</option>
          <option>Tomorrow</option>
          <option>This Weekend</option>
          <option>This Week</option>
          <option>This Month</option>
          <option>Custom Range</option>
        </select>
      </div>

      {/* Location Filter */}
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2 dark:text-gray-300">Location</h3>
        <div className="relative">
          <input 
            type="text" 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter location"
            className="w-full p-2 pr-10 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <button 
            onClick={handleGetLocation}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-500"
          >
            <MapPin size={20} />
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2 dark:text-gray-300">Category</h3>
        <select className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white">
          <option>All Categories</option>
          <option>Conference</option>
          <option>Music Festival</option>
          <option>Workshop</option>
          <option>Networking</option>
          <option>Sports</option>
          <option>Art & Culture</option>
        </select>
      </div>

      {/* Interest Description */}
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2 dark:text-gray-300">Interests</h3>
        <textarea 
          placeholder="Describe your interests (e.g., tech, music, art)"
          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white h-24"
        />
      </div>

      {/* Additional Options */}
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-2 dark:text-gray-300">Additional Options</h3>
        <div className="space-y-2">
          <label className="flex items-center dark:text-gray-300">
            <input type="checkbox" className="mr-2" />
            Free Events Only
          </label>
          <label className="flex items-center dark:text-gray-300">
            <input type="checkbox" className="mr-2" />
            Online Events
          </label>
          <label className="flex items-center dark:text-gray-300">
            <input type="checkbox" className="mr-2" />
            Family Friendly
          </label>
          <label className="flex items-center dark:text-gray-300">
            <input type="checkbox" className="mr-2" />
            Accessible Events
          </label>
        </div>
      </div>

      {/* Apply Filter Button */}
      <button className="w-full bg-green-600  hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition duration-200 flex items-center justify-center">
        <FilterIcon className="mr-2" />
        Apply Filters
      </button>
    </div>
  );
};

export default Filter;