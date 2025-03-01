import { Button } from "../ui/button";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="w-full bg-gray-50 dark:bg-gray-900 py-12 flex flex-col items-center text-center px-6">
      <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
        Ready to Discover Your Next Experience?
      </h2>
      <p className="text-lg mb-6 text-gray-600 dark:text-gray-300">
        Join our community of event enthusiasts and start discovering
        personalized experiences that match your interests and schedule.
      </p>
      <Link href={"/events"}>
        <Button className="border border-black dark:border-white py-2 px-8 rounded-lg font-semibold bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 transition flex items-center gap-2">
          View Events{" "}
        </Button>
      </Link>
    </section>
  );
}
