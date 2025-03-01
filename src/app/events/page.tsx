"use client";

import React, { useState, useEffect, useCallback } from "react";
import EventCard from "../../components/dash/EventCard";
import Filter from "../../components/dash/Filter";
import { Button } from "@/components/ui/button";

// Debounce function for search input optimization
const debounce = (func: Function, delay: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

const DashboardPage = () => {
  interface Event {
    id: number;
    title: string;
    description: string;
    location: string;
    dateTime: string;
    image: string;
    keywords: string[];
    eventType: string;
    eventLocationType: string;
    organizer: string;
    organizerId: number;
    externalLink: string;
    rsvp: any[];
    rsvpCount: number;
    createdAt: string;
    updatedAt: string;
  }

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    location: "",
    category: "",
    date: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [locations, setLocations] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      setSearchQuery(query);
      setCurrentPage(1);
    }, 500),
    []
  );

  // Fetch events from API
  useEffect(() => {
    let isMounted = true; // Prevent state updates after unmounting
    setLoading(true);

    const fetchEvents = async () => {
      try {
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: "10",
        });

        if (searchQuery) params.append("q", searchQuery);
        if (selectedFilters.location)
          params.append("location", selectedFilters.location);
        if (selectedFilters.category)
          params.append("eventType", selectedFilters.category);

        const response = await fetch(`/api/user/getAllEvents?${params}`);
        const data = await response.json();

        if (isMounted) {
          setEvents(data.events || []);
          setTotalPages(data.totalPages || 1);
          setLocations(data.locations || []);
          setCategories(data.eventTypes || []);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        if (isMounted) {
          setEvents([]);
          setLocations([]);
          setCategories([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchEvents();

    return () => {
      isMounted = false;
    };
  }, [currentPage, searchQuery, selectedFilters]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 pb-8">
      {/* Header */}
      <div className="text-center py-20">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
          Browse Events
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm lg:text-md mt-2">
          Explore events happening near you.
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Filter Column */}
          <div className="md:col-span-3 md:sticky md:top-20 bg-white dark:bg-gray-800 p-4 rounded-lg">
            <Filter
              locations={locations}
              categories={categories}
              dates={[]} // Optional, you can extract unique dates if needed
              selectedFilters={selectedFilters}
              setSelectedFilters={setSelectedFilters}
            />
          </div>

          {/* Events Column */}
          <div className="md:col-span-9">
            {/* Search Box */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search events..."
                onChange={(e) => debouncedSearch(e.target.value)}
                className="w-full p-3 border rounded-md bg-white shadow-md dark:bg-gray-800 dark:text-white focus:ring focus:ring-indigo-300"
              />
            </div>

            {/* Loading Indicator */}
            {loading ? (
              <div className="min-h-[200px] flex items-center justify-center">
                <p className="text-gray-600 dark:text-gray-400">
                  Loading events...
                </p>
              </div>
            ) : (
              <>
                {/* Events List */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {events.length > 0 ? (
                    events.map((event) => (
                      <div
                        key={event.id}
                        className="animate-fade-in transform transition duration-300 ease-in-out"
                      >
                        <EventCard event={event} />
                      </div>
                    ))
                  ) : (
                    <p className="col-span-full text-center text-gray-500 dark:text-gray-400">
                      No events found.
                    </p>
                  )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-6 space-x-4">
                    <Button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <span className="mx-4">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
