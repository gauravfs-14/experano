import { NextApiRequest, NextApiResponse } from "next";
import { currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  if (!email) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const userPreference = await prisma.user.findUnique({
      where: { email },
    });

    if (!userPreference) {
      return res.status(404).json({ error: "No preferences found" });
    }

    return res.status(200).json(userPreference);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}
