"use client";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Loader, UserRound } from "lucide-react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

 import Link from "next/link";
import {useUser} from "@/lib/useUser";

function ListingContact() {
  const [ph, setPh] = useState("");
  const [callbackTime, setCallbackTime] = useState("");
  const [isValid, setIsValid] = useState(false);
  const { user, isSignedIn } = useUser();
   const [loader, setLoader] = useState(false);

  const saveCallbackRequest = async () => {
    console.log("Ph : ", ph);
    console.log("Callback Time : ", callbackTime);
    console.log("User : ", user?.primaryEmailAddress.emailAddress);
    setLoader(true);
  };

  const handleCallBackSet = (value) => {
    setCallbackTime(value);
  };

  useEffect(() => {
    const phoneRegex = /^\d{10}$/;
    if (phoneRegex && phoneRegex.test(ph) && callbackTime) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [ph, callbackTime]);

  return (
    <div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex gap-2">
              <UserRound size={16} />
              Contact
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Request Callback</DialogTitle>
              <DialogDescription>
                Get a callback for this property within a your specified time
              </DialogDescription>
            </DialogHeader>
            {isSignedIn ? 
            <div className="grid gap-4 py-2">
              <div className=" items-center gap-4">
                <Label htmlFor="ph" className="text-right">
                  Enter Phone Number
                </Label>
                <Input
                  type="tel"
                  id="ph"
                  className="mt-2"
                  placeholder="XXXXXXXXXX"
                  onChange={(e) => setPh(e.target.value)}
                  value={ph}
                />
              </div>
              <div className=" items-center gap-4">
                <Label htmlFor="callbackList" className="text-right">
                  When should we callback
                </Label>

                <Select
                  className=""
                  id="callbackList"
                  onValueChange={handleCallBackSet}
                  value={callbackTime}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select Time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Now">Now</SelectItem>
                    <SelectItem value="5min">Within 5 min</SelectItem>
                    <SelectItem value="10min">Within 10 min</SelectItem>
                    <SelectItem value="15min">Within 15 min</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div> : 
            ''
          }
            
            <DialogFooter>
              <DialogClose asChild>
                {isSignedIn? <Button
                  type="submit"
                  onClick={saveCallbackRequest}
                  disabled={!isValid}
                >
                  {loader ? <Loader className="animate-spin" /> : "Submit"}
                </Button>  : 
                <Button className="w-full" variant="destructive"><Link href={'/signin'}>Sign in to view</Link></Button>}
                
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
       
    </div>
  );
}

export default ListingContact;
