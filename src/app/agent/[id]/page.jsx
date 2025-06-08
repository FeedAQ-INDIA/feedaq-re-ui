import ImageCarousel from "@/app/_components/ImageCarousel";
import {Button} from "@/components/ui/button";
import Head from "next/head";
import {CheckLine, Globe, HeartPlus, Mail, MessageCircle, Phone, Share2} from "lucide-react";
import Link from "next/link";
import React  from "react";
import MapMarker from "@/app/_components/MapMarker";
import Image from "next/image";
import {Badge} from "@/components/ui/badge";
import UserTrackClient from "@/app/_components/UserTrackClient";
import {apiClient} from "@/lib/apiClient.mjs";
import FavButton from "@/app/property/[id]/_components/FavButton";
import ShareButton from "@/app/property/[id]/_components/ShareButton";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import "./pg-colive.css"

async function AgentDetail({params}) {
    const {id} = params;


    const res = await fetch('http://localhost:8080/search-v2', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            limit: 5,
            offset: 0,
            getThisData: {
                datasource: "Agent",
                attributes: [],
                where: {agentId: id},
                include: [

                    {datasource: "User", as: "user", required: false}
                ]
            }
        }),
        cache: 'no-store', // disables static caching
    });

    if (!res.ok) {
        const text = await res.text();
        return <div>Error fetching data: {text}</div>;
    }

    const data = await res.json();
    const listing = data?.data?.results?.[0]
    console.log(data?.data?.results?.[0]);



    return (
        <>
            <Head>

            </Head>
             <div className="px-2 md:px-6  my-3 mt-5 ">

                         <div className="flex overflow-x-auto gap-2">
                             {listing?.agentIsGold ? (<Badge variant="outline" className="rounded-sm">
                                 Gold Partner
                             </Badge>):<></>}
                             {listing?.agentIsVerified ? (<Badge variant="outline" className="rounded-sm">
                                 Verified
                             </Badge>):<></>}
                              <Badge variant="outline" className="rounded-sm">
                                 Total Listing : {listing?.agentTotalListings}
                             </Badge>
                             {[


                                 { label: "Experience (Years)", value: listing?.agentExperience },
                                 { label: "License Number", value: listing?.agentLicenseNumber },

                                 { label: "Total Listings", value: listing?.agentTotalListings },

                                 // { label: "Created At", value: listing?.v_created_date + ' ' + listing?.v_created_time },
                             ].map(
                                 (item, index) =>( item.value ?  <Badge variant="outline" className="rounded-sm">
                                         {item.label} : {String(item.value)}
                                 </Badge> : <></>))
                             }


                         </div>

                 <div>
                     <div className="flex flex-wrap gap-4 items-center   my-4">
                         <div className="flex justify-center  ">
                             <Avatar className="w-24 h-24">
                                 <AvatarFallback className="text-2xl">
                                     {listing?.agentNameInitial}
                                 </AvatarFallback>
                             </Avatar>
                         </div>
                         <div className=" tracking-wide   ">
                                  <h2 className="font-semibold text-lg line-clamp-1">{listing?.agentAgencyName}</h2>
                                 <h2 className="font-medium text-muted-foreground text-md line-clamp-1">{listing?.user?.firstName +' '+listing?.user?.lastName}</h2>


                                         <div className="flex overflow-x-auto gap-2 mt-1">
                                             <p className="text-xs text-muted-foreground tracking-normal">
                                                 {listing?.agentOfficeAddress?.toUpperCase()} - {listing?.agentCity?.toUpperCase()} - {listing?.agentState?.toUpperCase()} - {listing?.agentCountry?.toUpperCase()}
                                             </p>
                                         </div>


 
                         </div>
                     </div>
                 </div>




                 <div className="mb-6 flex gap-2 flex-col">


                     <div className="flex-wrap flex items-center gap-2 my-2">
                         <Link className=" "
                               href={`https://wa.me/9631045873?text=Hi! I want detail regarding property id ${listing?.agentId}`}
                               target="_blank">
                             <Button className="bg-green-500 text-white hover:bg-green-600 flex gap-1 items-center">
                                 <MessageCircle/>
                                 Whatsapp
                             </Button>
                         </Link>

                         <Button className="bg-pink-500 text-white hover:bg-pink-600 flex gap-1 items-center ">
                             <Phone/> Contact
                         </Button>


                         <Button className="bg-purple-500 text-white hover:bg-purple-600 flex gap-1 items-center ">
                             <Mail /> Email
                         </Button>

                         <Link className=" "
                               href={listing.agentWebsite}
                               target="_blank">
                             <Button className="bg-sky-500 text-white hover:bg-sky-600 flex gap-1 items-center">
                                 <Globe />
                                 Website
                             </Button>
                         </Link>

                         <ShareButton/>

                     </div>


                 </div>

                 <div className="my-4 flex flex-wrap gap-2 items-center">
                     <p className="text-xs text-muted-foreground">Agent Id : {listing?.agentId}</p>
                     <div className=" sm:ml-auto">
                         {listing?.agentIsVerified ?
                             <Badge
                                 className="tracking-wider rounded-sm bg-green-600 text-white flex gap-1 animate-blink"><CheckLine
                                 size={14}/><span>Verified</span></Badge>
                             : <></>}
                     </div>
                 </div>
                 <div className="my-2">
                     <h2 className="font-bold text-xl tracking-wide">Overview</h2>
                    <p className="my-2 whitespace-pre w-full overflow-hidden  ">{listing?.agentBio}</p>
                 </div>

                 <div className="my-6">
                     <h2 className="font-bold text-xl tracking-wide ">Location</h2>
                     <p className="mt-2 whitespace-pre w-full overflow-hidden  ">{listing?.agentOfficeAddress}</p>
                     <p className=" whitespace-pre w-full overflow-hidden  ">{listing?.agentCity}</p>
                     <p className=" whitespace-pre w-full overflow-hidden  ">{listing?.agentState}</p>
                     <p className=" whitespace-pre w-full overflow-hidden  ">{listing?.agentCountry}</p>


                 </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0 border border-gray-200 rounded-md overflow-hidden mb-4">
                     {[


                         { label: "Experience (Years)", value: listing?.agentExperience },
                         { label: "License Number", value: listing?.agentLicenseNumber },
                         { label: "Verified Agent", value: listing?.agentIsVerified ? "Yes" : "No" },
                         { label: "Gold Agent", value: listing?.agentIsGold ? "Yes" : "No" },
                           { label: "Total Listings", value: listing?.agentTotalListings },

                         { label: "Created At", value: listing?.v_created_date + ' ' + listing?.v_created_time },
                         { label: "Updated At", value: listing?.v_updated_date + ' ' + listing?.v_updated_time },
                      ].map(
                         (item, index) =>
                              (
                                 <div
                                     key={index}
                                     className="border border-gray-200 px-4 py-2 flex flex-col cursor-pointer hover:bg-gray-50 hover:shadow-sm"
                                 >
                                     <p className="text-sm text-muted-foreground">{item.label}</p>
                                     <p className="text-base font-medium">
                                         {String(item.value).toUpperCase()}
                                     </p>
                                 </div>
                             )
                     )}
                 </div>




            </div>

        </>
    );
}

export default AgentDetail;
