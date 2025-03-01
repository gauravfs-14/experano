import React from "react";

interface FilterProps {
  locations: string[];
  categories: string[];
  dates: string[];
  selectedFilters: {
    location: string;
    category: string;
    date: string;
  };
  setSelectedFilters: React.Dispatch<
    React.SetStateAction<{
      location: string;
      category: string;
      date: string;
    }>
  >;
}

const Filter: React.FC<FilterProps> = ({
  locations,
  categories,
  dates,
  selectedFilters,
  setSelectedFilters,
}) => {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
      <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
        Filter Events
      </h2>

      {/* Location Filter */}
      <label className="block mb-2 text-gray-700 dark:text-gray-300">
        Location
      </label>
      <div className="relative">
        <select
          className="w-full p-2 border rounded-md dark:bg-gray-900 dark:text-white appearance-none pr-8"
          value={selectedFilters.location}
          onChange={(e) =>
            setSelectedFilters((prev) => ({
              ...prev,
              location: e.target.value,
            }))
          }
        >
          <option value="">All Locations</option>
          {locations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-700 dark:text-gray-300"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      {/* Category Filter */}
      <label className="block mt-4 mb-2 text-gray-700 dark:text-gray-300">
        Category
      </label>
      <div className="relative">
        <select
          className="w-full p-2 border rounded-md dark:bg-gray-900 dark:text-white appearance-none pr-8"
          value={selectedFilters.category}
          onChange={(e) =>
            setSelectedFilters((prev) => ({
              ...prev,
              category: e.target.value,
            }))
          }
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-700 dark:text-gray-300"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      {/* Date Filter */}
      <label className="block mt-4 mb-2 text-gray-700 dark:text-gray-300">
        Date
      </label>
      <div className="relative">
        <select
          className="w-full p-2 border rounded-md dark:bg-gray-900 dark:text-white appearance-none pr-8"
          value={selectedFilters.date}
          onChange={(e) =>
            setSelectedFilters((prev) => ({ ...prev, date: e.target.value }))
          }
        >
          <option value="">All Dates</option>
          {dates.map((date) => (
            <option key={date} value={date}>
              {date}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-700 dark:text-gray-300"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Filter;
