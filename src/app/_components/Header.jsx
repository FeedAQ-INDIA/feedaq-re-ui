import { Button } from "@/components/ui/button";
 import {Play, Plus, Power} from "lucide-react";
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
      <header className="flex h-14 items-center justify-between bg-white px-4 shadow-sm border-b">
          {/* Logo */}
          <a
              className="text-2xl sm:text-3xl font-bold text-rose-500 tracking-wide"
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
                  <Button variant="secondary" className="flex gap-2 items-center cursor-pointer">
                      <Power />
                      <span>GET STARTED</span>
                  </Button>
              </a>
          </div>

          {/* Mobile Hamburger */}
          <div className="flex md:hidden ml-auto">
              <a href={`/signin`}>
                  <Button variant="secondary" className="flex gap-2 items-center cursor-pointer">
                      <Power />
                     <span>GET STARTED</span>
                  </Button>
              </a>

          </div>
      </header>  );
}

export default Header;
