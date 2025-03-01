import React, { useState } from "react";
import Image from "next/image";

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

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const [isGoing, setIsGoing] = useState(
    event.rsvp.some((user) => user.userId === "currentUserId")
  );
  const [localRsvpCount, setLocalRsvpCount] = useState(event.rsvpCount);

  const handleRsvp = () => {
    setIsGoing(!isGoing);
    setLocalRsvpCount((prev) => (isGoing ? prev - 1 : prev + 1));
  };
  return (
    <div className="flex flex-col items-center">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden max-w-md w-full border border-gray-200 dark:border-gray-700">
        <div className="relative h-56">
          <Image
            src={
              "https://th.bing.com/th/id/OIP.yMKGQul_x604TeHvMlbRPAHaE8?rs=1&pid=ImgDetMain"
            }
            alt={event.title}
            fill
            className="object-cover rounded-t-2xl"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between text-xs mb-3">
            <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 px-3 py-1 rounded-full font-semibold">
              {event.eventType}
            </span>
            <div className="flex items-center space-x-2">
              <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-3 py-1 rounded-full font-medium">
                {new Date(event.dateTime).toLocaleDateString()}
              </span>
              <a
                href={event.externalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 transition"
              >
                Tickets
              </a>
            </div>
          </div>

          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {event.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
            {event.location}
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
            {event.description}
          </p>

          <div className="flex flex-wrap gap-2 mt-3">
            {event.keywords.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-1 rounded-full text-xs font-medium shadow-sm"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between">
            <a
              href={event.externalLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center border border-black dark:border-white py-2 rounded-lg font-semibold bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 transition"
            >
              View Event ↗
            </a>

            <div className="flex items-center ml-4">
              <button
                onClick={handleRsvp}
                className={`flex items-center px-4 py-2 rounded-full border transition-colors duration-200 ${
                  isGoing
                    ? "bg-green-700 dark:bg-green-600 text-white border-green-700 dark:border-green-600"
                    : "bg-white dark:bg-gray-800 text-green-500 dark:text-green-400 border-green-500 dark:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/30"
                }`}
              >
                <span className="mx-2">Going</span>
                <span className="text-sm font-medium ml-2">
                  {localRsvpCount}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
