"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import UserOnboarding from "./user-onboarding/default";

export default function UserPreferencesDisplay() {
  const { getToken } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getToken(); // Get Clerk token
        const response = await fetch("/api/user/getUserAndPreference", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Pass token
          },
          cache: "no-store",
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Please login to continue.");
          } else if (response.status === 404) {
            setIsNotFound(true);
            throw new Error("Please Complete profile first.");
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        }

        const jsonData = await response.json();
        setData(jsonData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p className="text-center text-blue-500">Loading...</p>; // You can replace this with Next.js default loading component if available
  }

  if (error) {
    return (
      <div className="text-center flex items-center justify-center space-x-4 my-5">
        <p className="text-red-500">{error}</p>
        {isNotFound && (
          <Dialog>
            <DialogTrigger>
              <Button className="cursor-pointer">Complete Profile</Button>
            </DialogTrigger>
            <DialogContent className="h-fit max-h-[80vh]">
              <DialogHeader>
                <UserOnboarding />
              </DialogHeader>
            </DialogContent>
          </Dialog>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <pre className="text-gray-700">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
