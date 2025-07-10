"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils"; // assuming you use a cn util for class merging

function DeveloperListingCard({ listing, active }) {
    const {
        avatar,
        name = "Unknown Developer",
        website,
        email,
        contactNumber,
        description,
        agentId,
    } = listing || {};

    const fallbackInitials = name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <div
            className={cn(
                "p-3 border rounded-md shadow bg-white hover:shadow-lg hover:bg-rose-50 cursor-pointer overflow-x-hidden text-black",
                active && "ring-2 ring-rose-500"
            )}
        >
            <div className="flex flex-col sm:flex-row items-center gap-4">
                <Avatar className="w-24 h-24 shadow">
                    <AvatarImage src={avatar} alt={name} />
                    <AvatarFallback className="text-xl">{fallbackInitials}</AvatarFallback>
                </Avatar>

                <div className="space-y-1 w-full">
                    <h2 className="font-semibold text-lg  ">{name}</h2>
                    {website && (
                        <h3 className="font-medium text-muted-foreground text-md ">
                            <a href={website} target="_blank" rel="noopener noreferrer">
                                {website}
                            </a>
                        </h3>
                    )}
                    {email && (
                        <p className=" text-muted-foreground text-md  ">{email}</p>
                    )}
                    {contactNumber && (
                        <p className=" text-muted-foreground text-md  ">
                            {contactNumber}
                        </p>
                    )}
                    {description && (
                        <p className=" text-muted-foreground text-md line-clamp-2">
                            {description}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DeveloperListingCard;
