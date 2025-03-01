import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/navbar/default";

export const metadata: Metadata = {
  title: "Experano: Personalized experiences wherever you go",
  description:
    "Experano is a personalized recommendation web app, which recommends events and activities near the user based on the user preferences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <Navbar />
      {children}
    </ClerkProvider>
  );
}
