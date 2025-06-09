import React, {useState} from "react";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Award, CheckLine, ExternalLink, Info, X} from "lucide-react";
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
                                    {listing?.agentPartnerType ? (<Badge
                                            className="tracking-wider rounded-sm bg-yellow-600 text-white flex gap-1  shadow">
                                            <Award size={14}
                                                   className="text-yellow-300"/><span>{listing?.agentPartnerType}</span></Badge>)
                                        : <></>}
                                    {listing?.agentIsVerified ?
                                        <Badge
                                            className="tracking-wider rounded-sm bg-green-600 text-white flex gap-1   shadow"><CheckLine
                                            size={14}/><span>Verified</span></Badge>
                                        : <></>}
                                    <Badge variant="outline" className="rounded-sm shadow">
                                        Total Listing : {listing?.agentTotalListings}
                                    </Badge>
                                    {[


                                        {label: "Experience (Years)", value: listing?.agentExperience},
                                        {label: "License Number", value: listing?.agentLicenseNumber},
                                        {label: "Operating Since", value: listing?.agentOperatingSince},

                                        {label: "Total Listings", value: listing?.agentTotalListings},

                                        // { label: "Created At", value: listing?.v_created_date + ' ' + listing?.v_created_time },
                                    ].map(
                                        (item, index) => (item.value ? <Badge variant="outline" className="rounded-sm shadow">
                                            {item.label} : {String(item.value)}
                                        </Badge> : <></>))
                                    }


                                </div>
                            </div>
                        </div>

                        <div className="wrapper">
                            <div className="marquee">
                                <div className="flex overflow-x-auto gap-2">
                                    {
                                        listing?.agentSpecializations && (
                                            <Badge variant="outline" className="rounded-sm bg-rose-500 text-white">SPECIALIZATION</Badge>)}

                                    {listing?.agentSpecializations?.map(a => (

                                        <Badge variant="outline"
                                               className="rounded-sm shadow"> {a}</Badge>
                                    ))}

                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center mt-2">
                            <Avatar className="w-24 h-24 shadow">
                                <AvatarFallback className="text-3xl">
                                    {listing?.agentNameInitial}
                                </AvatarFallback>
                            </Avatar>
                        </div>

                        <div className="p-0 tracking-wide text-center mt-2">
                            <Link href={`/agent/${listing?.agentId}`}>
                                <h2 className="font-semibold text-lg line-clamp-1">{listing?.agentAgencyName}</h2>
                                <h2 className="font-medium text-muted-foreground text-md line-clamp-1">{listing?.user?.firstName + ' ' + listing?.user?.lastName}</h2>

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
                                <h2 className="font-medium text-muted-foreground text-md line-clamp-1">{listing?.user?.firstName + ' ' + listing?.user?.lastName}</h2>

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
