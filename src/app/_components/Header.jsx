import { Button } from "@/components/ui/button";
 import {Play, Plus} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
 import React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function Header() {


  return (
      <header className="flex h-16 items-center justify-between bg-white px-4 shadow-md border-b">
          {/* Logo */}
          <a
              className="text-2xl sm:text-3xl font-medium text-black"
              href="/"
              style={{
                  fontFamily: [
                      "Lucida Sans",
                      "Lucida Sans Regular",
                      "Lucida Grande",
                      "Lucida Sans Unicode",
                      "Geneva",
                  ],
              }}          >
              LANDKING
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4 ml-4">
              {/*<NavigationMenuDemo />*/}
          </div>

          {/* Right-side button */}
          <div className="hidden md:flex items-center gap-2 ml-auto">
              <a href={`/signin`}>
                  <Button variant="secondary" className="">
                    LOG IN
                  </Button>
              </a>
          </div>

          {/* Mobile Hamburger */}
          <div className="flex md:hidden ml-auto">
              <a href={`/signin`}>
                  <Button variant="secondary">
LOGIN                  </Button>
              </a>

          </div>
      </header>  );
}

export default Header;
