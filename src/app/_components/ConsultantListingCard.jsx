"use client"
import React, {useState} from "react";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Award, CheckLine, ExternalLink, Info, X} from "lucide-react";
import "./pg-colive.css";
import Link from "next/link";
import {useUser} from "@/lib/useUser";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";


function ConsultantListingCard({listing, active}) {
    const [screenNo, setScreenNo] = useState(true);

    const {user, refreshUser} = useUser();

    const handleScreenNo = () => {
        setScreenNo(!screenNo);
        console.log(screenNo);
    };


    return (
        <div className="p-3 border shadow hover:shadow-lg hover:bg-rose-50 cursor-pointer overflow-x-hidden rounded-md bg-white h-fit text-black">
            <Link
                href={`/consultant/${listing.agentId}`}
                target="_blank"
                rel="noopener noreferrer" className="flex-1"
            > <div className="overflow-y-auto">
                     <div className=" ">
                        <div className="wrapper">
                            <div className="marquee animate-8">
                                <div className="flex overflow-x-auto gap-2">
                                    {listing?.agentPartnerType ? (<Badge
                                            className="tracking-wider rounded-none bg-yellow-600 text-white flex gap-1  shadow">
                                            <Award size={14}
                                                   className="text-yellow-300"/><span>{listing?.agentPartnerType}</span></Badge>)
                                        : <></>}
                                    {listing?.agentIsVerified ?
                                        <Badge
                                            className="tracking-wider rounded-none bg-green-600 text-white flex gap-1   shadow"><CheckLine
                                            size={14}/><span>Verified</span></Badge>
                                        : <></>}
                                    <Badge variant="outline" className="rounded-none shadow">
                                        Total Listing : {listing?.agentTotalListings}
                                    </Badge>
                                    {[


                                        {label: "Experience (Years)", value: listing?.agentExperience},
                                        {label: "License Number", value: listing?.agentLicenseNumber},
                                        {label: "Operating Since", value: listing?.agentOperatingSince},

                                        {label: "Total Listings", value: listing?.agentTotalListings},

                                        // { label: "Created At", value: listing?.v_created_date + ' ' + listing?.v_created_time },
                                    ].map(
                                        (item, index) => (item.value ? <Badge variant="outline" className="rounded-none shadow">
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
                                            <Badge variant="outline" className="rounded-none bg-rose-500 text-white">SPECIALIZATION</Badge>)}

                                    {listing?.agentSpecializations?.map(a => (

                                        <Badge variant="outline"
                                               className="rounded-none shadow"> {a}</Badge>
                                    ))}

                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center mt-2 gap-4">
                            <Avatar className="w-26 h-26 shadow">
                                <AvatarImage src="https://photos.zillowstatic.com/fp/05c43f9895b928ea6de04a4724ac8f5c-h_g.jpg" />
                                <AvatarFallback className="text-3xl">
                                    {listing?.agentNameInitial}
                                </AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                                <h2 className="font-semibold text-lg line-clamp-1">{listing?.agentAgencyName}</h2>
                                <h2 className="font-medium text-muted-foreground text-md line-clamp-1">{listing?.user?.firstName + ' ' + listing?.user?.lastName}</h2>
                                <p className="text-xs text-muted-foreground tracking-normal line-clamp-2">
                                     {listing.addressLine1},  {listing.addressLine2},  {listing.locality},  {listing.city},  {listing.state} -  {listing.zipCode},  {listing.country}                                </p>
                            </div>

                        </div>

                        <div className="p-0 tracking-wide text-center mt-2">
                            <Link href={`/consultant/${listing?.agentId}`}>


                                <p className=" mt-1 text-xs text-muted-foreground">{listing?.project?.name ? listing?.project?.name?.toUpperCase() + ' - ' : ' '} {listing?.locatedIn?.locality}</p>
                            </Link>

                        </div>
                    </div>

            </div>
            </Link>

        </div>
    );
}

export default ConsultantListingCard;
