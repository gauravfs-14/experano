import { Home } from "lucide-react";
import Link from "next/link";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-center">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-white">404</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
        Oops! The page you&apos;re looking for doesn&apos;t exist.
      </p>

      <Link
        href="/"
        className="mt-5 flex items-center px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition duration-300"
      >
        <Home className="w-5 h-5 mr-2" />
        Return Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
