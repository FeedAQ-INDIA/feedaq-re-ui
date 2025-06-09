import {Button} from "@/components/ui/button";
import Head from "next/head";
import {Award, CheckLine, Globe, Mail, MessageCircle, Phone} from "lucide-react";
import Link from "next/link";
import React from "react";
import {Badge} from "@/components/ui/badge";
import ShareButton from "@/app/property/[id]/_components/ShareButton";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import "./pg-colive.css"
import {Card, CardHeader} from "@/components/ui/card";

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

                <Card className="rounded-sm bg-muted/50 border-none">
                    <CardHeader>
                        <div className="flex overflow-x-auto gap-2">
                            {listing?.agentPartnerType ? ( <Badge
                                    className="tracking-wider rounded-sm bg-yellow-600 text-white flex gap-1 animate-blink">
                                    <Award size={14} className="text-yellow-300"/><span>{listing?.agentPartnerType}</span></Badge>)
                                : <></>}
                            {listing?.agentIsVerified ?
                                <Badge
                                    className="tracking-wider rounded-sm bg-green-600 text-white flex gap-1 animate-blink"><CheckLine
                                    size={14}/><span>Verified</span></Badge>
                                : <></>}
                            <Badge variant="outline" className="rounded-sm">
                                Total Listing : {listing?.agentTotalListings}
                            </Badge>
                            {[


                                {label: "Experience (Years)", value: listing?.agentExperience},
                                {label: "License Number", value: listing?.agentLicenseNumber},
                                {label: "Operating Since", value: listing?.agentOperatingSince},

                                {label: "Total Listings", value: listing?.agentTotalListings},

                                // { label: "Created At", value: listing?.v_created_date + ' ' + listing?.v_created_time },
                            ].map(
                                (item, index) => (item.value ? <Badge variant="outline" className="rounded-sm">
                                    {item.label} : {String(item.value)}
                                </Badge> : <></>))
                            }


                        </div>



                        <div className="flex flex-wrap gap-4 items-center   my-4">
                            <div className="flex justify-center  ">
                                <Avatar className="w-24 h-24 shadow">
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
                                        {listing?.agentOfficeAddress?.toUpperCase()} - {listing?.agentCity?.toUpperCase()} - {listing?.agentState?.toUpperCase()} - {listing?.agentCountry?.toUpperCase()}
                                    </p>
                                </div>


                            </div>
                        </div>




                            <div className="flex-wrap flex items-center gap-2 my-4">
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
                                    <Mail/> Email
                                </Button>

                                <Link   href={listing?.agentWebsite}
                                        target="_blank">
                                    <Button className="bg-sky-500 text-white hover:bg-sky-600 flex gap-1 items-center">
                                        <Globe/>
                                        Website
                                    </Button>
                                </Link>

                                <ShareButton/>

                            </div>



                        <div className="mt-2 flex flex-wrap gap-2 items-center">
                            <p className="text-xs text-muted-foreground">Agent Id : {listing?.agentId}</p>
                            <div className=" sm:ml-auto">
                                {listing?.agentIsVerified ?
                                    <Badge
                                        className="tracking-wider rounded-sm bg-green-600 text-white flex gap-1 animate-blink"><CheckLine
                                        size={14}/><span>Verified</span></Badge>
                                    : <></>}
                            </div>
                        </div>

                    </CardHeader>
                </Card>

                <Card className="rounded-sm bg-muted/50 border-none my-6">
                    <CardHeader>  <h2 className="font-bold text-xl tracking-wide">Overview</h2>
                        <p className="my-2 whitespace-pre w-full overflow-hidden  ">{listing?.agentBio}</p>
                    </CardHeader>

                </Card>

                <Card className="rounded-sm bg-muted/50 border-none my-6">
                    <CardHeader>
                        <h2 className="font-bold text-xl tracking-wide">Specialization</h2>
                        <div className="my-2  w-full flex flex-wrap gap-2 ">{listing?.agentSpecializations?.map(a => (<Badge variant="secondary" className="p-1 rounded-sm">{a}</Badge>))}</div>

                    </CardHeader>

                </Card>


                <Card className="rounded-sm bg-muted/50 border-none my-6">
                    <CardHeader>
                        <h2 className="font-bold text-xl tracking-wide">Areas Served</h2>
                        <div className="my-2  w-full flex flex-wrap gap-2 ">{listing?.agentAreasServed?.map(a => (<Badge variant="secondary" className="p-1 rounded-sm">{a}</Badge>))}</div>

                    </CardHeader>

                </Card>

                <Card className="rounded-sm bg-muted/50 border-none my-6">
                    <CardHeader>
                        <h2 className="font-bold text-xl tracking-wide">Language</h2>
                        <div className="my-2  w-full flex flex-wrap gap-2 ">{listing?.agentLanguagesSpoken?.map(a => (<Badge variant="secondary" className="p-1 rounded-sm">{a}</Badge>))}</div>
                    </CardHeader>

                </Card>

                <Card className="rounded-sm bg-muted/50 border-none my-6">
                    <CardHeader>
                        <h2 className="font-bold text-xl tracking-wide ">Location</h2>
                        <p className="mt-2 whitespace-pre w-full overflow-hidden  ">{listing?.agentOfficeAddress}</p>
                        <p className=" whitespace-pre w-full overflow-hidden  ">{listing?.agentCity}</p>
                        <p className=" whitespace-pre w-full overflow-hidden  ">{listing?.agentState}</p>
                        <p className=" whitespace-pre w-full overflow-hidden  ">{listing?.agentCountry}</p>
                    </CardHeader>

                </Card>


            </div>

        </>
    );
}

export default AgentDetail;
