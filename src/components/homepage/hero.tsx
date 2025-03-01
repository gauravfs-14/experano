import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="w-full py-60 flex flex-col items-center text-center text-gray-900 px-6">
      <h1 className="text-5xl font-bold mb-4 dark:text-white">
        Your Smart Event Discovery Platform
      </h1>
      <p className="text-lg mb-6 max-w-3xl text-gray-600 dark:text-gray-300">
        Join thousands of event-goers discovering personalized experiences. From
        local meetups to major events, find what matches your interests with
        smart recommendations.
      </p>
      <Link href={"/smart-discover"}>
        <Button className="border border-black dark:border-white py-2 px-8 rounded-lg font-semibold bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 transition flex items-center gap-2 text-lg">
          Explore Events <ArrowRight size={20} />
        </Button>
      </Link>
    </section>
  );
}
