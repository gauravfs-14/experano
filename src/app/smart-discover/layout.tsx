import type { Metadata } from "next";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/nextjs";
import Navbar from "@/components/navbar/default";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import UserPreferencesDisplay from "@/components/UserPreferencesDisplay";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Experano: Personalized experiences wherever you go",
  description:
    "Experano is a personalized recommendation web app, which recommends events and activities near the user based on the user preferences.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await currentUser();

  if (!user) {
    return (
      <ClerkProvider>
        <Navbar />

        <p className="min-h-[80vh] w-screen flex justify-center items-center">
          Please login to continue.
        </p>
      </ClerkProvider>
    );
  }

  const email = user?.primaryEmailAddress?.emailAddress;

  if (!email) {
    redirect("/error?message=No email found");
  }

  const preferences = await prisma.user.findUnique({
    where: {
      email: email,
    },
    select: {
      userPreferences: true,
    },
  });

  return (
    <ClerkProvider>
      <Navbar />

      <>
        <SignedIn>
          {!preferences?.userPreferences ? (
            <UserPreferencesDisplay />
          ) : (
            children
          )}
        </SignedIn>
        <SignedOut>
          <p>Please login to continue.</p>
        </SignedOut>
      </>
    </ClerkProvider>
  );
}
