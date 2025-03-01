import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    // Parse query parameters from the URL
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const query = searchParams.get("q")?.trim() || "";
    const location = searchParams.get("location")?.trim() || "";
    const eventType = searchParams.get("eventType")?.trim() || "";

    // Ensure valid pagination values
    if (page < 1 || limit < 1) {
      return NextResponse.json(
        { error: "Invalid pagination parameters" },
        { status: 400 }
      );
    }

    // Calculate offset for pagination
    const skip = (page - 1) * limit;

    // Build dynamic where filter
    let whereClause: any = {};

    // Use Prisma's `LOWER()` function for case-insensitive search in SQLite
    if (query) {
      whereClause.AND = [
        {
          OR: [
            {
              title: {
                contains: query, // Case-sensitive (SQLite workaround required)
              },
            },
            {
              description: {
                contains: query, // Case-sensitive (SQLite workaround required)
              },
            },
          ],
        },
      ];
    }

    if (location) {
      whereClause.location = { contains: location };
    }

    if (eventType) {
      whereClause.eventType = { contains: eventType };
    }

    // Fetch total count of events matching filters
    const totalEvents = await prisma.event.count({ where: whereClause });
    const totalPages = totalEvents > 0 ? Math.ceil(totalEvents / limit) : 1;

    // Fetch paginated events based on filters
    const events = await prisma.event.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { dateTime: "asc" },
    });

    // Fetch unique locations & event types directly from database
    const uniqueLocations = await prisma.event.findMany({
      select: { location: true },
      distinct: ["location"],
    });

    const uniqueEventTypes = await prisma.event.findMany({
      select: { eventType: true },
      distinct: ["eventType"],
    });

    return NextResponse.json(
      {
        page,
        limit,
        totalEvents,
        totalPages,
        events: events.length > 0 ? events : [],
        locations: uniqueLocations.map((l) => l.location).filter(Boolean),
        eventTypes: uniqueEventTypes.map((et) => et.eventType).filter(Boolean),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events. Please try again later." },
      { status: 500 }
    );
  }
};
