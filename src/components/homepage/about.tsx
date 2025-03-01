import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

export default function About() {
  return (
    <section className="py-20 px-6 bg-gray-50 dark:bg-gray-900 text-center">
      <h2 className="text-4xl font-bold mb-8 text-gray-800 dark:text-gray-200">
        How Experano Works
      </h2>
      <div className="max-w-3xl my-20 mx-auto text-left">
        <Accordion type="single" collapsible>
          <AccordionItem value="search">
            <AccordionTrigger className="text-left no-underline">
              Powerful Event Discovery
            </AccordionTrigger>
            <AccordionContent>
              Find events that match your interests using our comprehensive
              search and filtering system. Filter by location, category, and
              date to discover the perfect events for you.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="rsvp">
            <AccordionTrigger className="text-left no-underline">
              Simple RSVP Management
            </AccordionTrigger>
            <AccordionContent>
              Keep track of events you&apos;re interested in with our RSVP
              system. See who else is going and manage your event attendance all
              in one place.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="create">
            <AccordionTrigger className="text-left no-underline">
              Event Organization
            </AccordionTrigger>
            <AccordionContent>
              Create and manage your own events through our platform. Add
              details, track attendance, and reach potential attendees easily.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}
