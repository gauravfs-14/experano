"use client";

import React from "react";
import EventCard from "../../components/dash/EventCard";
import Filter from "../../components/dash/Filter";

const scrollbarHideStyles = {
  msOverflowStyle: "none" /* IE and Edge */,
  scrollbarWidth: "none" /* Firefox */,
  "&::webkit-scrollbar": {
    display: "none" /* Chrome, Safari and Opera */,
  },
  scrollBehavior: "smooth",
} as React.CSSProperties;

const DashboardPage = () => {
  const events = [
    {
      id: "1",
      title: "Tech Conference 2025",
      location: "San Francisco, CA",
      imageUrl: "https://picsum.photos/800/400",
      date: new Date("2025-06-15T10:00:00"),
      eventType: "Conference",
      rsvpCount: 234,
      description: "Join us for the biggest tech conference of the year!",
      tags: ["Tech", "Networking", "Innovation"],
      externalLink: "https://example.com/event1",
      likesCount: 40,
      rsvp: [
        {
          userId: "u5",
          name: "",
          avatar: "",
        },
      ],
    },
    {
      id: "2",
      title: "Music Fest 2025",
      location: "Los Angeles, CA",
      imageUrl: "https://picsum.photos/800/401",
      date: new Date("2025-07-20T18:00:00"),
      eventType: "Music Festival",
      rsvpCount: 542,
      description: "An unforgettable night of music, dance, and fun!",
      tags: ["Music", "Festival", "Concert"],
      externalLink: "https://example.com/event2",
      likesCount: 60,
      rsvp: [
        {
          userId: "u6",
          name: "",
          avatar: "",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 md:overflow-hidden">
      {/* Header */}
      <div className="text-center py-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Event Discovery
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
          Explore events happening near you.
        </p>
      </div>

      {/* Three Column Layout that becomes rows on mobile */}
      <div className="flex-1 pb-6 md:overflow-hidden w-screen">
        <div className=" max-w-7xl grid grid-cols-1 md:grid-cols-12 gap-6 z-10 ">
          {/* Filter Column */}
          <div
            className="order-1 md:col-span-3 md:overflow-y-auto md:scroll-smooth md:h-auto md:fixed md:my-auto md:left-10 xl:left-20"
            style={scrollbarHideStyles}
          >
            <Filter />
          </div>

          {/* Events Column */}
          <div className="w-screen flex items-center justify-center pb-20">
            <div
              className="md:inset-0 md:flex md:justify-center"
              style={scrollbarHideStyles}
            >
              <div className="space-y-6 pr-4 min-w-3xl">
                {events.map((event, index) => (
                  <div
                    key={event.id}
                    className="animate-fade-in transform transition duration-300 ease-in-out"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <EventCard event={event} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div
            className="order-2 md:order-3 md:col-span-3 md:overflow-y-auto md:scroll-smooth md:h-auto"
            style={scrollbarHideStyles}
          >
            {/* Add content for the right column if needed */}
          </div>
        </div>
      </div>
    </div>
  );
};
export default DashboardPage;
