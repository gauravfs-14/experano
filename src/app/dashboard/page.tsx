"use client";

import React, { useState, useEffect } from "react";
import EventCard from "../../components/dash/EventCard";
import Filter from "../../components/dash/Filter";

const scrollbarHideStyles = {
  msOverflowStyle: "none",
  scrollbarWidth: "none",
  "&::webkit-scrollbar": {
    display: "none",
  },
  scrollBehavior: "smooth",
} as React.CSSProperties;

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
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    location: "",
    category: "",
    date: "",
  });

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/user/getMatchingEvents");
        const data = await response.json();
        setEvents(data.recommended_events);
        setFilteredEvents(data.recommended_events);
      } catch (error) {
        console.error("Error fetching events:", error);
        setEvents([]);
        setFilteredEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Extract unique locations, categories, and dates
  const locations = Array.from(new Set(events.map((event) => event.location)));
  const categories = Array.from(
    new Set(events.map((event) => event.eventType))
  );
  const dates = Array.from(
    new Set(events.map((event) => event.dateTime.split("T")[0]))
  );

  // Handle filtering
  useEffect(() => {
    let filtered = events;

    if (searchQuery) {
      filtered = filtered.filter((event) =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedFilters.location) {
      filtered = filtered.filter(
        (event) => event.location === selectedFilters.location
      );
    }

    if (selectedFilters.category) {
      filtered = filtered.filter(
        (event) => event.eventType === selectedFilters.category
      );
    }

    if (selectedFilters.date) {
      filtered = filtered.filter((event) =>
        event.dateTime.startsWith(selectedFilters.date)
      );
    }

    setFilteredEvents(filtered);
  }, [searchQuery, selectedFilters, events]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 pb-8">
      {/* Header */}
      <div className="text-center py-20">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
          Event Discovery
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm lg:text-md mt-2">
          Explore events happening near you.
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Filter Column */}
          <div
            className="md:col-span-3 md:sticky md:top-20 bg-white dark:bg-gray-800 p-4 rounded-lg h-[calc(100vh-6rem)]"
            style={scrollbarHideStyles}
          >
            <Filter
              locations={locations}
              categories={categories}
              dates={dates}
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 border rounded-md bg-white shadow-md dark:bg-gray-800 dark:text-white focus:ring focus:ring-indigo-300"
              />
            </div>

            {/* Events List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
