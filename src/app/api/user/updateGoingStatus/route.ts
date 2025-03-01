import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { eventId, userId } = await req.json();

    if (!eventId || !userId) {
      return NextResponse.json(
        { error: "Missing eventId or userId" },
        { status: 400 }
      );
    }

    // Get the current event
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { rsvp: true, rsvpCount: true },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Ensure RSVP is an array (if it's null or undefined, initialize as an empty array)
    let updatedRsvp: { userId: string }[] = Array.isArray(event.rsvp)
      ? (event.rsvp as { userId: string }[])
      : [];
    let newRsvpCount = event.rsvpCount;

    // Check if the user is already in the RSVP list
    const isGoing = updatedRsvp.some((rsvp) => rsvp.userId === userId);

    if (isGoing) {
      // Remove user from RSVP list
      updatedRsvp = updatedRsvp.filter((rsvp) => rsvp.userId !== userId);
      newRsvpCount = Math.max(newRsvpCount - 1, 0); // Ensure count doesn't go below 0
    } else {
      // Add user to RSVP list
      updatedRsvp.push({ userId });
      newRsvpCount += 1;
    }

    // Update the database
    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        rsvp: updatedRsvp, // Ensure it's always an array
        rsvpCount: newRsvpCount,
      },
      select: { rsvp: true, rsvpCount: true },
    });

    return NextResponse.json({
      success: true,
      rsvp: updatedEvent.rsvp,
      rsvpCount: updatedEvent.rsvpCount,
    });
  } catch (error) {
    console.error("Error updating RSVP:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
