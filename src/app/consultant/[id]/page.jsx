import {Button} from "@/components/ui/button";
import Head from "next/head";
import {CheckLine, Globe, Mail, Map, MessageCircle, Phone} from "lucide-react";
import Link from "next/link";
import React from "react";
import {Badge} from "@/components/ui/badge";
import ShareButton from "@/app/property/[id]/_components/ShareButton";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import "./pg-colive.css"
import {Card, CardHeader} from "@/components/ui/card";
import Image from "next/image";
import MapMarker from "@/app/_components/MapMarker";

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

    const decideColorBadgeBGForPartType = () => {
        if (!listing?.agentPartnerType) return;

        switch (listing.agentPartnerType) {
            case 'Platinum Member':
                return {bg: 'bg-slate-800', text: 'text-slate-200'};
            case 'Gold Member':
                return {bg: 'bg-yellow-600', text: 'text-yellow-100'};
            case 'Silver Member':
                return {bg: 'bg-gray-500', text: 'text-gray-100'};
            case 'Bronze Member':
                return {bg: 'bg-amber-700', text: 'text-amber-100'};
            default:
                return {bg: 'bg-gray-300', text: 'text-gray-700'};
        }
    };

    return (
        <>
            <Head>

            </Head>
            <div className="px-2 md:px-6  my-3 mt-6 ">

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 my-4">
                    <div className=" lg:col-span-3">
                        <Card className="rounded-sm bg-muted/50 border-none">
                            <CardHeader>
                                <div className="flex overflow-x-auto gap-2">
                                    {listing?.agentPartnerType ? (<Badge
                                            className={`tracking-wider rounded-xs ${decideColorBadgeBGForPartType()?.bg} text-white flex gap-1 animate-blink`}>
                                            {/*<Award size={14} className={decideColorBadgeBGForPartType()?.text}/>*/}
                                            <span>{listing?.agentPartnerType}</span></Badge>)
                                        : <></>}


                                    {listing?.agentIsVerified ?
                                        <Badge
                                            className="tracking-wider rounded-xs bg-green-600 text-white flex gap-1 animate-blink"><CheckLine
                                            size={14}/><span>Verified</span></Badge>
                                        : <></>}
                                    <Badge variant="outline" className="rounded-xs">
                                        Total Listing : {listing?.agentTotalListings}
                                    </Badge>
                                    {[


                                        {label: "Experience (Years)", value: listing?.agentExperience},
                                        {label: "License Number", value: listing?.agentLicenseNumber},
                                        {label: "Operating Since", value: listing?.agentOperatingSince},

                                        {label: "Total Listings", value: listing?.agentTotalListings},

                                        // { label: "Created At", value: listing?.v_created_date + ' ' + listing?.v_created_time },
                                    ].map(
                                        (item, index) => (item.value ? <Badge variant="outline" className="rounded-xs">
                                            {item.label} : {String(item.value)}
                                        </Badge> : <></>))
                                    }


                                </div>


                                <div className="flex flex-wrap gap-4 items-center   my-4">
                                    <div className="flex justify-center  ">
                                        <Avatar className="w-26 h-26 shadow">
                                            <AvatarImage src="https://photos.zillowstatic.com/fp/05c43f9895b928ea6de04a4724ac8f5c-h_g.jpg" />
                                            <AvatarFallback className="text-3xl">
                                                {listing?.agentNameInitial}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                    <div className=" tracking-wide   ">
                                        <h2 className="font-semibold text-lg line-clamp-1">{listing?.agentAgencyName}</h2>
                                        <h2 className="font-medium text-muted-foreground text-md line-clamp-1">{listing?.user?.firstName + ' ' + listing?.user?.lastName}</h2>

                                        <div className="flex overflow-x-auto gap-2 mt-1">
                                            <p className="text-xs text-muted-foreground tracking-normal">
                                                {listing?.locality?.toUpperCase()} - {listing?.city?.toUpperCase()} - {listing?.state?.toUpperCase()} - {listing?.country?.toUpperCase()}
                                            </p>
                                        </div>
                                        <p className="text-xs text-muted-foreground">#{listing?.agentId}</p>


                                    </div>
                                </div>


                                <div className="flex-wrap flex items-center gap-2 my-2">
                                    <Link className=" "
                                          href={`https://wa.me/9631045873?text=Hi! I want detail regarding property id ${listing?.agentId}`}
                                          target="_blank">
                                        <Button
                                            className="bg-green-500 text-white hover:bg-green-600 flex gap-1 items-center">
                                            <MessageCircle/>
                                            Whatsapp
                                        </Button>
                                    </Link>

                                    <Button
                                        className="bg-pink-500 text-white hover:bg-pink-600 flex gap-1 items-center ">
                                        <Phone/> Contact
                                    </Button>


                                    <Button
                                        className="bg-purple-500 text-white hover:bg-purple-600 flex gap-1 items-center ">
                                        <Mail/> Email
                                    </Button>

                                    <Link href={listing?.agentWebsite}
                                          target="_blank">
                                        <Button
                                            className="bg-sky-500 text-white hover:bg-sky-600 flex gap-1 items-center">
                                            <Globe/>
                                            Website
                                        </Button>
                                    </Link>

                                    <ShareButton/>

                                </div>


                                {/*<div className="mt-2 flex flex-wrap gap-2 items-center">*/}
                                {/*    <p className="text-xs text-muted-foreground">Partner Id : {listing?.agentId}</p>*/}
                                {/*    <div className=" sm:ml-auto">*/}
                                {/*        {listing?.agentIsVerified ?*/}
                                {/*            <Badge*/}
                                {/*                className="tracking-wider rounded-xs bg-green-600 text-white flex gap-1 animate-blink"><CheckLine*/}
                                {/*                size={14}/><span>Verified</span></Badge>*/}
                                {/*            : <></>}*/}
                                {/*    </div>*/}
                                {/*</div>*/}

                            </CardHeader>
                        </Card>
                    </div>
                    <div className="hidden lg:block">
                        <MapMarker
                            lat={listing?.geom?.coordinates?.[0]}
                            lng={listing?.geom?.coordinates?.[1]}
                            detail={listing?.title}
                            cutsomClassName={"w-full h-[300px] rounded-md"} // Fully rounded corners
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 my-4">
                    <div className=" lg:col-span-3">
                        <div className="my-2">
                            <h2 className="font-bold text-xl tracking-wide">Overview</h2>
                            <p className="my-4 whitespace-pre w-full overflow-hidden  ">{listing?.agentBio}</p>

                        </div>


                        <div className="my-6">
                            <h2 className="font-bold text-xl tracking-wide">Specialization</h2>
                            <div
                                className="my-4  w-full flex flex-wrap gap-2 ">{listing?.agentSpecializations?.map(a => (
                                <Badge variant="secondary" className="p-1 rounded-xs">{a}</Badge>))}</div>

                        </div>


                        <div className="my-6">
                            <h2 className="font-bold text-xl tracking-wide">Areas Served</h2>
                            <div
                                className="my-2  w-full flex flex-wrap gap-2 ">{listing?.agentAreasServed?.map(a => (
                                <Badge variant="secondary" className="p-1 rounded-xs">{a}</Badge>))}</div>

                        </div>

                        <div className="my-6">
                            <h2 className="font-bold text-xl tracking-wide">Language</h2>
                            <div
                                className="my-4  w-full flex flex-wrap gap-2 ">{listing?.agentLanguagesSpoken?.map(a => (
                                <Badge variant="secondary" className="p-1 rounded-xs">{a}</Badge>))}</div>
                        </div>


                        <div className="my-6">
                            <h2 className="font-bold text-xl tracking-wide">Location</h2>

                            <div className=" whitespace-pre-wrap text-muted-foreground my-4 space-y-2">
                                {[
                                    {label: "Address Line 1", value: listing?.addressLine1},
                                    {label: "Address Line 2", value: listing?.addressLine2},
                                    {label: "Locality", value: listing?.locality},
                                    {label: "City", value: listing?.city},
                                    {label: "State", value: listing?.state},
                                    {label: "Zip Code", value: listing?.zipCode},
                                    {label: "Country", value: listing?.country},
                                    {label: "Latitude", value: listing?.latitude},
                                    {label: "Longitude", value: listing?.longitude},
                                    // {label: "Map Ref Id", value: listing?.mapReferenceId},
                                    // {label: "Map Ref Address", value: listing?.mapReferenceAddress},
                                ]?.map(a => (
                                    <p><span className="font-medium">{a.label}</span> - <span
                                        className="text-black">{a.value}</span></p>
                                ))}

                                <Link className="cursor-pointer"
                                      href={`https://www.google.com/maps/search/?api=1&query=${listing?.latitude},${listing?.longitude}`}
                                      target="_blank">
                                    <Button variant="outline" className="cursor-pointer"><Map/>Click here to open the
                                        location in google map</Button></Link>
                            </div>
                        </div>

                    </div>
                    <div className="hidden lg:block">
                        <Image
                            src={'https://cdn.vectorstock.com/i/1000v/40/01/vertical-banner-04-vector-29244001.jpg'}
                            alt="Picture of the author"
                            width={200}
                            height={800}
                            className="w-full h-full rounded-md"
                        />
                    </div>
                </div>
            </div>

        </>
    );
}

export default AgentDetail;
