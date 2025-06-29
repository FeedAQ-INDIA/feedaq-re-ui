import { Button } from "@/components/ui/button";
import { MessageCircle, UserRound } from "lucide-react";
import Image from "next/image";
import React from "react";
import ListingContact from "./ListingContact";
import Link from "next/link";

function AgentDetail({ agentName, agentEmail }) {
  const maskEmail = (email) => {
    const parts = email.split("@");
    const maskedUsername = parts[0].replace(/./g, "X");
    return maskedUsername + "@" + parts[1];
  };

  return (
    <div className="flex flex-wrap gap-5 items-center justify-between p-5 rounded-lg shadow-md border my-6">
      <div className="flex items-center gap-6 max-w-full">
        <Image
          src={
            "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yaWZRa0IzbGtTdllvSDVKSWhVZVR0aE5VSVYifQ"
          }
          width={60}
          height={60}
          className="rounded-full"
        />
        <div className="truncate">
          <h2 className="text-lg font-bold truncate">{agentName}</h2>
          <h2 className="text-gray-500 truncate">{maskEmail(agentEmail)}</h2>
        </div>
      </div>
      <div className="flex-shrink-0 flex items-center gap-2">
        <ListingContact />
        <Link href={`https://wa.me/9631045873?text=Hi ! I want detail regarding pg/colive property id 33`} target="_blank">
           <Button className="bg-green-500 text-white hover:bg-green-600 gap-2">
            <MessageCircle size={16} />
            Whatsapp
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default AgentDetail;
