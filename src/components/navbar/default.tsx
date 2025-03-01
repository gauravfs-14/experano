"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <nav className="w-full bg-background sticky top-0 z-50 border-b">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold">
          Experano
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-6">
          <Link href="/features" className="hover:text-primary">
            Features
          </Link>
          <Link href="/pricing" className="hover:text-primary">
            Pricing
          </Link>
          <Link href="/about" className="hover:text-primary">
            About
          </Link>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          {/* Dark mode toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </Button>

          <SignedOut>
            <SignUpButton>
              <Button variant="default" className="ml-2">
                Sign Up
              </Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-background border-t border-border">
          <div className="flex flex-col items-center py-4 space-y-3">
            <Link
              href="/features"
              className="hover:text-primary"
              onClick={() => setIsOpen(false)}
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="hover:text-primary"
              onClick={() => setIsOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className="hover:text-primary"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
