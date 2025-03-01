import { Search, Users, CalendarPlus } from "lucide-react";

export default function Features() {
  return (
    <section className="py-36 px-6 max-w-6xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-12 -mt-4 text-gray-800 dark:text-gray-200">
        Discover, Connect, and Engage
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="p-8 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-md flex flex-col items-center text-center">
          <Search size={40} className="text-gray-900 dark:text-gray-300 mb-4" />
          <h3 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-gray-300">
            Smart Search
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Find events easily with powerful filters for location, category, and
            date.
          </p>
        </div>
        <div className="p-8 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-md flex flex-col items-center text-center">
          <Users size={40} className="text-gray-900 dark:text-gray-300 mb-4" />
          <h3 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-gray-300">
            RSVP System
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Easily track event attendance and manage your RSVPs in one place.
          </p>
        </div>
        <div className="p-8 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-md flex flex-col items-center text-center">
          <CalendarPlus
            size={40}
            className="text-gray-900 dark:text-gray-300 mb-4"
          />
          <h3 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-gray-300">
            Event Creation
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Create and publish your own events with our simple event management
            system.
          </p>
        </div>
      </div>
    </section>
  );
}
