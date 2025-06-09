import React, {useState} from "react";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {ExternalLink, Info, X} from "lucide-react";
import "./pg-colive.css";
import Link from "next/link";
import {useUser} from "@/lib/useUser";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";


function AgentListingCard({listing, active}) {
    const [screenNo, setScreenNo] = useState(true);

    const {user, refreshUser} = useUser();

    const handleScreenNo = () => {
        setScreenNo(!screenNo);
        console.log(screenNo);
    };


    return (
        <div className="p-3 border shadow hover:shadow-lg overflow-x-hidden rounded-md bg-white">
            <div className="overflow-y-auto">
                {screenNo ? (
                    <div className="min-h-[240px] h-fit">
                        <div className="wrapper">
                            <div className="marquee">
                                <div className="flex overflow-x-auto gap-2">
                                    <Badge variant="outline" className="rounded-sm">
                                        2400 sqft.
                                    </Badge>
                                    <Badge variant="outline" className="rounded-sm">
                                        2 HSARING AC : Rs.3000/-
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center mt-2">
                            <Avatar className="w-24 h-24">
                                <AvatarFallback className="text-xl">
                                    {listing?.agentNameInitial}
                                </AvatarFallback>
                            </Avatar>
                        </div>

                        <div className="p-0 tracking-wide text-center mt-2">
                            <Link href={`/agent/${listing?.agentId}`}>
                                <h2 className="font-semibold text-lg line-clamp-1">{listing?.agentAgencyName}</h2>
                                <h2 className="font-medium text-muted-foreground text-md line-clamp-1">{listing?.user?.firstName +' '+listing?.user?.lastName}</h2>

                                <div className="wrapper">
                                    <div className="marquee animate-14">
                                        <div className="flex overflow-x-auto gap-2">
                                            <p className="text-xs text-muted-foreground tracking-normal">
                                                {listing?.agentOfficeAddress}
                                            </p>

                                        </div>
                                    </div>
                                </div>
                                {/*              <h2 className="font-bold text-sm ">{formatIndianCurrency(listing?.price)} <span*/}
                                {/*                  className="text-muted-foreground text-xs font-normal">₹11.46 K/sq.ft*/}
                                {/*Avg. Price</span></h2>*/}
                                <p className=" mt-1 text-xs text-muted-foreground">{listing?.project?.name ? listing?.project?.name?.toUpperCase() + ' - ' : ' '} {listing?.locatedIn?.locality}</p>
                            </Link>

                        </div>
                    </div>
                ) : (
                    <div className="h-[240px]">
                        <div className="p-1">

                            <div className="wrapper">
                                     <div className="marquee">
                                        <div className="flex overflow-x-auto gap-2">
                                            <Badge variant="outline" className="rounded-sm">
                                                2400 sqft.
                                            </Badge>
                                            <Badge variant="outline" className="rounded-sm">
                                                2 HSARING AC : Rs.3000/-
                                            </Badge>
                                        </div>
                                    </div>
                             </div>

                            <div className="tracking-wide">
                                <h2 className="font-semibold text-lg line-clamp-1">{listing?.agentAgencyName}</h2>
                                <h2 className="font-medium text-muted-foreground text-md line-clamp-1">{listing?.user?.firstName +' '+listing?.user?.lastName}</h2>

    <p className="my-1  text-xs text-muted-foreground">{listing?.agentOfficeAddress}</p>

                                <p className="  text-sm mt-2 ">{listing?.agentBio}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="flex flex-wrap gap-2 mt-2">


                <Link
                    href={`/agent/${listing.agentId}`}
                    target="_blank"
                    rel="noopener noreferrer" className="flex-1"
                >
                    <Button variant="secondary" className='w-full' size="sm">
                        <ExternalLink/>
                    </Button>
                </Link>

                {screenNo ? (
                    <Button onClick={handleScreenNo} size="sm" className="cursor-pointer" className="flex-1">
                        <Info/>
                    </Button>
                ) : (
                    <Button variant="destructive" onClick={handleScreenNo} size="sm" className="cursor-pointer"
                            className="flex-1">
                        <X/>
                    </Button>
                )}
            </div>
        </div>
    );
}

export default AgentListingCard;
