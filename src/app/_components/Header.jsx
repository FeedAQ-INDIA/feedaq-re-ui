"use client";
import { Button } from "@/components/ui/button";
 import {Play, Plus, Power} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
 import {useState} from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {useUser} from "@/lib/useUser";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {Avatar, AvatarFallback} from "@/components/ui/avatar";


function Header() {

    const { user, loading } = useUser();
    const [open, setOpen] = useState(false);

    if (loading) return <p>Loading...</p>;
    // if (!user) return <p>Redirecting to login...</p>; // or redirect manually

    const handleClose = () => setOpen(false);

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
          <div className="hidden md:flex items-center gap-4 ml-4 tracking-wider">
              {/*<NavigationMenuDemo />*/}

          </div>

          {/* Right-side button */}
          <div className="hidden md:flex items-center gap-2 ml-auto">


                  {!user? <Link href={`/signin?redirectUri=${window.location.href}`}><Button
                      variant="secondary"
                      className="flex gap-2 items-center cursor-pointer"

                  >
                      <span>LOGIN / SIGNUP</span>
                  </Button> </Link>:
                      <Sheet open={open} onOpenChange={setOpen}>
                          <SheetTrigger asChild>
                              <Button
                                  // variant="secondary"
                                  className="flex gap-2 items-center cursor-pointer bg-rose-500 text-white hover:bg-gray-100 hover:text-black"

                              >
                                  <span>{user?.data?.nameInitial}</span>
                              </Button>
                          </SheetTrigger>
                          <SheetContent className="p-0">
                              <SheetHeader>
                                  <SheetTitle className="bg-rose-500 text-white p-6 flex gap-4 items-center">
                                      <Avatar className="w-12 h-12 shadow">
                                          <AvatarFallback className="text-xl text-rose-600">{user?.data?.nameInitial}</AvatarFallback>
                                      </Avatar>
                                      <span>Hello, {user?.data?.firstName}</span></SheetTitle>
                                   <SheetDescription className="p-6">
                                    <div className="flex flex-wrap gap-4">
                                        <Link href={"/account/recent"} onClick={handleClose} className="w-full text-left cursor-pointer"><Button variant="secondary" className="w-full text-left cursor-pointer">Recently Viewed</Button></Link>
                                        <Link href={"/account/fav"} onClick={handleClose} className="w-full text-left cursor-pointer"><Button variant="secondary" className="w-full text-left cursor-pointer">Saved Items</Button></Link>
                                        <Link href={"/account"} onClick={handleClose} className="w-full text-left cursor-pointer"><Button variant="secondary" className="w-full text-left cursor-pointer">Account Settings</Button></Link>
                                        <Link href={"/manage-listing"} onClick={handleClose} className="w-full text-left cursor-pointer"><Button variant="secondary" className="w-full text-left cursor-pointer">Manage Listing</Button></Link>
                                        {!user?.data?.isAgent ?   <Link href={"/register-as-consultant"} onClick={handleClose} className="w-full text-left cursor-pointer"><Button variant="secondary" className="w-full text-left cursor-pointer">Register as Agent</Button></Link> :<></>}
                                        <Link href={`http://localhost:8080/auth/logout?redirectUri=${window.location.href}`} onClick={handleClose} className="w-full text-left cursor-pointer"><Button variant="secondary" className="w-full text-left cursor-pointer">Sign Out</Button></Link>
                                    </div>
                                  </SheetDescription>
                              </SheetHeader>
                          </SheetContent>
                      </Sheet>  }

           </div>

          {/* Mobile Hamburger */}
          <div className="flex md:hidden ml-auto">
              {!user? <Link href={`/signin?redirectUri=${window.location.href}`}><Button
                      variant="secondary"
                      className="flex gap-2 items-center cursor-pointer"

                  >
                      <span>LOGIN / SIGNUP</span>
                  </Button> </Link>:
                  <Sheet open={open} onOpenChange={setOpen}>
                      <SheetTrigger asChild>
                          <Button
                              // variant="secondary"
                              className="flex gap-2 items-center cursor-pointer bg-rose-500 text-white hover:bg-gray-100 hover:text-black"

                          >
                              <span>{user?.data?.nameInitial}</span>
                          </Button>
                      </SheetTrigger>
                      <SheetContent className="p-0">
                          <SheetHeader>
                              <SheetTitle className="bg-rose-500 text-white p-6 flex gap-4 items-center">
                                  <Avatar className="w-12 h-12 shadow">
                                      <AvatarFallback className="text-xl text-rose-600">{user?.data?.nameInitial}</AvatarFallback>
                                  </Avatar>
                                  <span>Hello, {user?.data?.firstName}</span></SheetTitle>
                              <SheetDescription className="p-6">
                                  <div className="flex flex-wrap gap-4">
                                      <Link href={"/account/recent"} onClick={handleClose} className="w-full text-left cursor-pointer"><Button variant="secondary" className="w-full text-left cursor-pointer">Recently Viewed</Button></Link>
                                      <Link href={"/account/fav"} onClick={handleClose} className="w-full text-left cursor-pointer"><Button variant="secondary" className="w-full text-left cursor-pointer">Saved Items</Button></Link>
                                      <Link href={"/account"} onClick={handleClose} className="w-full text-left cursor-pointer"><Button variant="secondary" className="w-full text-left cursor-pointer">Account Settings</Button></Link>
                                      <Link href={"/manage-listing"} onClick={handleClose} className="w-full text-left cursor-pointer"><Button variant="secondary" className="w-full text-left cursor-pointer">Manage Listing</Button></Link>
                                      {!user?.data?.isAgent ?   <Link href={"/register-as-agent"} onClick={handleClose} className="w-full text-left cursor-pointer"><Button variant="secondary" className="w-full text-left cursor-pointer">Register as Agent</Button></Link> :<></>}
                                      <Link href={`http://localhost:8080/auth/logout?redirectUri=${window.location.href}`} onClick={handleClose} className="w-full text-left cursor-pointer"><Button variant="secondary" className="w-full text-left cursor-pointer">Sign Out</Button></Link>
                                  </div>
                              </SheetDescription>
                          </SheetHeader>
                      </SheetContent>
                  </Sheet>  }
          </div>
      </header>  );
}

export default Header;
