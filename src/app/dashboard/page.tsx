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
          userId: "u1",
          name: "John Doe",
          avatar: "https://i.pravatar.cc/40?u=u1",
        },
        {
          userId: "u2",
          name: "Jane Smith",
          avatar: "https://i.pravatar.cc/40?u=u2",
        },
        {
          userId: "u3",
          name: "Mike Johnson",
          avatar: "https://i.pravatar.cc/40?u=u3",
        },
        {
          userId: "u4",
          name: "Sarah Wilson",
          avatar: "https://i.pravatar.cc/40?u=u4",
        },
        {
          userId: "u5",
          name: "Alex Brown",
          avatar: "https://i.pravatar.cc/40?u=u5",
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
          name: "Emma Davis",
          avatar: "https://i.pravatar.cc/40?u=u6",
        },
        {
          userId: "u7",
          name: "Chris Taylor",
          avatar: "https://i.pravatar.cc/40?u=u7",
        },
        {
          userId: "u8",
          name: "Pat Murphy",
          avatar: "https://i.pravatar.cc/40?u=u8",
        },
        {
          userId: "u9",
          name: "Sam Lee",
          avatar: "https://i.pravatar.cc/40?u=u9",
        },
        {
          userId: "u10",
          name: "Jordan Chen",
          avatar: "https://i.pravatar.cc/40?u=u10",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen md:h-screen flex flex-col bg-gray-50 dark:bg-gray-900 md:overflow-hidden">
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
      <div className="flex-1 px-4 pb-6 md:overflow-hidden">
        <div className="h-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Filter Column */}
          <div
            className="order-1 md:col-span-3 md:overflow-y-auto md:scroll-smooth md:h-auto"
            style={scrollbarHideStyles}
          >
            <Filter />
          </div>

          {/* Events Column */}
          <div className="order-3 md:order-2 md:col-span-6 md:relative">
            <div
              className="md:absolute md:inset-0 md:overflow-y-auto md:scroll-smooth"
              style={scrollbarHideStyles}
            >
              <div className="space-y-6 pr-4">
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