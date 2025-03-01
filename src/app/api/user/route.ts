import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import fs from "fs/promises";

export async function GET() {
  try {
    // Read events from JSON file
    const filePath = "./src/app/api/user/synthetic_event_data_1000.json"; // Update the correct file path
    const fileContent = await fs.readFile(filePath, "utf-8");
    const events = JSON.parse(fileContent);

    if (!Array.isArray(events) || events.length === 0) {
      return NextResponse.json(
        { error: "Invalid JSON format. Expected an array of events." },
        { status: 400 }
      );
    }

    // Process and insert/update each event
    const updatedEvents = await Promise.all(
      events.map(async (event) => {
        // Convert dateTime properly
        const dateTime = new Date(event.dateTime || Date.now());

        // Ensure `keywords` is stored as an array
        const keywords: string[] = Array.isArray(event.keywords)
          ? event.keywords
          : event.keywords.split(", ").map((k: string) => k.trim());

        // Try finding an existing event based on multiple identifiers
        const existingEvent = await prisma.event.findFirst({
          where: {
            title: event.title,
            dateTime,
            location: event.location,
          },
        });

        if (existingEvent) {
          // If event exists, update it
          return await prisma.event.update({
            where: { id: existingEvent.id },
            data: {
              description: event.description,
              image: event.image,
              keywords,
              eventType: event.event_type,
              eventLocationType: event.eventLocType,
              organizer: event.organizer || null,
              organizerId: event.organizer_id || null,
              externalLink: event.ext_link,
              rsvp: event.rsvp ? JSON.parse(event.rsvp) : [],
              rsvpCount: event.rsvpCount || 0,
            },
          });
        } else {
          // If event doesn't exist, create it
          return await prisma.event.create({
            data: {
              title: event.title,
              description: event.description,
              location: event.location,
              dateTime,
              image: event.image,
              keywords,
              eventType: event.event_type,
              eventLocationType: event.eventLocType,
              organizer: event.organizer || null,
              organizerId: event.organizer_id || null,
              externalLink: event.ext_link,
              rsvp: event.rsvp ? JSON.parse(event.rsvp) : [],
              rsvpCount: event.rsvpCount || 0,
            },
          });
        }
      })
    );

    return NextResponse.json({
      message: "Events updated successfully",
      updatedEvents,
    });
  } catch (error) {
    console.error("Error updating events:", error);
    return NextResponse.json(
      { error: "Failed to update events" },
      { status: 500 }
    );
  }
}
